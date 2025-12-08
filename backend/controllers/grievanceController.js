/**
 * @file grievanceController.js
 * @description Controller for handling internal grievance logic for both Customers and Admins.
 * Includes creating grievances, fetching personal history, and admin-specific retrievals.
 */

import Grievance from "../models/Grievance.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import StatusHistory from "../models/StatusHistory.js";
import Notification from "../models/Notification.js";
import { createAndSendNotification } from "../utils/notificationService.js";
import s3Client from "../config/s3Client.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Signs an S3 document URL to allow temporary access.
 * Checks if the URL belongs to the configured S3 bucket and generates a signed URL.
 * @param {string} url - The raw S3 URL or object path.
 * @returns {Promise<string>} Authentication signed URL or original URL if not S3.
 */
const signAttachment = async (url) => {
  if (!url || !url.startsWith("http")) return url;
  try {
    if (url.includes(process.env.AWS_BUCKET_NAME)) {
       // Extract Key from URL
       const parts = url.split("grievances/");
       if (parts.length > 1) {
         const key = "grievances/" + parts[1];
         const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
         });
         return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
       }
    }
    return url;
  } catch (e) {
    console.error("Error signing URL:", e);
    return url;
  }
};

/**
 * Generates a unique grievance ID with format PGS-TIMESTAMP-RANDOM.
 * @returns {string} Unique ID string.
 */
const generateGrievanceId = () =>
  "PGS-" +
  Date.now().toString(36).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

/**
 * Create a new grievance (Authenticated User).
 * Handles validation, file attachment paths, and initial notification.
 * @route POST /api/grievances
 */
export const createGrievance = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      description,
      categoryId,
      priority,
      location,
    } = req.body;

    let isAnonymous = req.body.isAnonymous;
    // Normalize boolean input from FormData
    if (isAnonymous === "true") isAnonymous = true;
    else if (isAnonymous === "false") isAnonymous = false;
    else isAnonymous = !!isAnonymous;

    if (!title || !description || !categoryId) {
      return res
        .status(400)
        .json({ message: "title, description and categoryId are required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    const user = await User.findById(userId);

    const createdBy = isAnonymous
      ? { name: "Anonymous", email: "", primaryContact: "" }
      : {
          name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
          email: user?.email || "",
          primaryContact: user?.primaryContact || "",
        };

    // Handle file uploads
    let attachmentPaths = [];
    let allFiles = [];

    if (req.files) {
      const photos = req.files["photos"] || [];
      const pdf = req.files["pdf"] || [];
      allFiles = [...photos, ...pdf];
      
      attachmentPaths = allFiles.map((f) => f.location || f.path);
    }

    const grievanceData = {
      grievanceId: generateGrievanceId(),
      userId: isAnonymous ? null : userId,
      createdBy,
      category: category._id,
      title,
      description,
      priority,
      location,
      attachments: attachmentPaths,
      isAnonymous,
    };

    const g = await Grievance.create(grievanceData);

    // Create Attachment records
    if (allFiles.length > 0) {
      const Attachment = (await import("../models/Attachment.js")).default;
      const attachmentDocs = allFiles.map((f) => ({
        grievanceId: g._id,
        fileName: f.originalname,
        filePath: f.location || f.path,
        fileType: f.mimetype,
        uploadedBy: userId,
      }));
      await Attachment.insertMany(attachmentDocs);
    }

    // Send notification if not anonymous
    if (!isAnonymous && userId) {
      await createAndSendNotification(
        userId,
        "Grievance Submitted",
        `Your grievance ${g.grievanceId} has been submitted successfully.`,
        {
          grievanceId: g.grievanceId,
          type: "grievanceSubmitted",
          title: g.title,
        }
      );
    }

    res.status(201).json(g);
  } catch (err) {
    console.error("CREATE GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Create a new anonymous grievance.
 * Similar to createGrievance but bypasses user authentication checks.
 * @route POST /api/grievances/anonymous
 */
export const createAnonymousGrievance = async (req, res) => {
  try {
    const {
      title,
      description,
      categoryId,
      priority,
      location,
      attachments = [],
    } = req.body;

    if (!title || !description || !categoryId) {
      return res
        .status(400)
        .json({ message: "title, description and categoryId are required" });
    }

    const category = await Category.findById(categoryId);
    if (!category) return res.status(400).json({ message: "Invalid category" });

    const g = await Grievance.create({
      grievanceId: generateGrievanceId(),
      userId: null,
      createdBy: {
        name: "Anonymous",
      },
      category: category._id,
      title,
      description,
      priority,
      location,
      attachments,
      isAnonymous: true,
    });

    res.status(201).json(g);
  } catch (err) {
    console.error("CREATE ANON GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get grievances for the logged-in user.
 * @route GET /api/grievances/me
 */
export const getMyGrievances = async (req, res) => {
  try {
    const list = await Grievance.find({ userId: req.user.id })
      .populate("category", "name key")
      .sort({ createdAt: -1 });
    
    res.json(list);
  } catch (err) {
    console.error("GET MY GRIEVANCES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get details of a single grievance for the logged-in user.
 * Signs attachment URLs for S3 access.
 * @route GET /api/grievances/:id
 */
export const getSingleGrievance = async (req, res) => {
  try {
    const found = await Grievance.findOne({
      grievanceId: req.params.id,
      userId: req.user.id,
    }).populate("category", "name key");

    if (!found) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    const gObj = found.toObject();
    if (gObj.attachments && gObj.attachments.length > 0) {
      gObj.attachments = await Promise.all(gObj.attachments.map(signAttachment));
    }

    res.json(gObj);
  } catch (err) {
    console.error("GET SINGLE GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * (Admin) Get all grievances.
 * @route GET /api/admin/grievances/all
 */
export const adminGetAll = async (req, res) => {
  try {
    const list = await Grievance.find()
      .populate("category", "name key")
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 });

    const mapped = list.map((g) => ({
      ...g.toObject(),
      categoryName: g.category?.name || "Uncategorized",
      assignedName: g.assignedTo
        ? `${g.assignedTo.firstName} ${g.assignedTo.lastName}`
        : "Unassigned",
    }));

    res.json(mapped);
  } catch (err) {
    console.error("ADMIN GET ALL ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * (Admin) Get single grievance details.
 * Includes history logs and signed attachment URLs.
 * @route GET /api/admin/grievances/:id
 */
export const adminGetOne = async (req, res) => {
  try {
    const g = await Grievance.findOne({ grievanceId: req.params.id })
      .populate("category", "name key")
      .populate("assignedTo", "firstName lastName email");

    if (!g) return res.status(404).json({ message: "Grievance not found" });

    const history = await StatusHistory.find({ grievance: g._id })
      .populate("changedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    const gObj = g.toObject();
    if (gObj.attachments && gObj.attachments.length > 0) {
      gObj.attachments = await Promise.all(gObj.attachments.map(signAttachment));
    }

    res.json({ grievance: gObj, history });
  } catch (err) {
    console.error("ADMIN GET ONE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * (Admin) Update grievance status manually via old endpoint logic.
 * @deprecated Use adminController.updateGrievanceStatus instead.
 */
export const updateStatus = async (req, res) => {
  try {
    const { status, note } = req.body;
    const g = await Grievance.findOne({ grievanceId: req.params.id });
    if (!g) return res.status(404).json({ message: "Grievance not found" });

    const oldStatus = g.status;
    g.status = status;
    await g.save();

    await StatusHistory.create({
      grievance: g._id,
      oldStatus,
      newStatus: status,
      changedBy: req.user.id,
      note,
    });

    if (g.userId) {
      await createAndSendNotification(
        g.userId,
        "Grievance Status Updated",
        `Your grievance ${g.grievanceId} status changed from ${oldStatus} to ${status}.`,
        {
          grievanceId: g.grievanceId,
          type: "statusUpdate",
          oldStatus,
          newStatus: status,
        }
      );
    }

    res.json(g);
  } catch (err) {
    console.error("UPDATE STATUS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * (Admin) Assign grievance to staff manually via old endpoint logic.
 * @deprecated Use adminController.assignOfficial instead.
 */
export const assignGrievance = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    const g = await Grievance.findOne({ grievanceId: req.params.id });
    if (!g) return res.status(404).json({ message: "Grievance not found" });

    g.assignedTo = assignedTo;
    g.status = "Assigned";
    await g.save();

    await StatusHistory.create({
      grievance: g._id,
      oldStatus: "Submitted",
      newStatus: "Assigned",
      changedBy: req.user.id,
      note: "Assigned to staff",
    });

    res.json(g);
  } catch (err) {
    console.error("ASSIGN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Add attachments to an existing grievance.
 * @route POST /api/grievances/:id/attachments
 */
export const addAttachments = async (req, res) => {
  try {
    const files = req.files || [];
    const filePaths = files.map((f) => `/uploads/${f.filename}`);

    const updated = await Grievance.findOneAndUpdate(
      { grievanceId: req.params.id, userId: req.user.id },
      { $push: { attachments: { $each: filePaths } } },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("ATTACHMENTS ERROR:", err);
    res.status(500).json({ message: "Attachment upload failed" });
  }
};
