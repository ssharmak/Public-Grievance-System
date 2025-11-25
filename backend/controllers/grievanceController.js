import Grievance from "../models/Grievance.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import StatusHistory from "../models/StatusHistory.js";
import Notification from "../models/Notification.js";
import { createAndSendNotification } from "../utils/notificationService.js";

const generateGrievanceId = () =>
  "PGS-" +
  Date.now().toString(36).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

// Citizen – create grievance (logged-in)
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
    if (req.files && req.files.length > 0) {
      attachmentPaths = req.files.map((f) => `/uploads/${f.filename}`);
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

    // Create Attachment documents
    if (req.files && req.files.length > 0) {
      const Attachment = (await import("../models/Attachment.js")).default;
      const attachmentDocs = req.files.map((f) => ({
        grievanceId: g._id,
        fileName: f.originalname,
        filePath: `/uploads/${f.filename}`,
        fileType: f.mimetype,
        uploadedBy: userId,
      }));
      await Attachment.insertMany(attachmentDocs);
    }

    // notify user (if not anonymous)
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

// Anonymous – no auth
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

// Citizen – own grievances
export const getMyGrievances = async (req, res) => {
  try {
    console.log("🔍 GET MY GRIEVANCES - userId:", req.user.id);
    
    const list = await Grievance.find({ userId: req.user.id })
      .populate("category", "name key")
      .sort({ createdAt: -1 });
    
    console.log("🔍 Found grievances:", list.length);
    if (list.length > 0) {
      console.log("🔍 First grievance:", {
        _id: list[0]._id,
        grievanceId: list[0].grievanceId,
        userId: list[0].userId,
        status: list[0].status,
      });
    }
    
    res.json(list);
  } catch (err) {
    console.error("GET MY GRIEVANCES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Citizen – single grievance by grievanceId
export const getSingleGrievance = async (req, res) => {
  try {
    const found = await Grievance.findOne({
      grievanceId: req.params.id,
      userId: req.user.id,
    }).populate("category", "name key");

    if (!found) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json(found);
  } catch (err) {
    console.error("GET SINGLE GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin – list all
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

// Admin – get grievance by grievanceId
export const adminGetOne = async (req, res) => {
  try {
    const g = await Grievance.findOne({ grievanceId: req.params.id })
      .populate("category", "name key")
      .populate("assignedTo", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email");

    if (!g) return res.status(404).json({ message: "Grievance not found" });

    // Enforce Department Access - REMOVED for single admin policy
    // if (req.user.role !== 'superadmin') { 
    //   if (req.user.managedCategories && req.user.managedCategories.length > 0) {
    //      const grievanceCategoryKey = g.category?.key;
    //      if (!req.user.managedCategories.includes(grievanceCategoryKey)) {
    //         return res.status(403).json({ message: "Access denied: You do not manage this category." });
    //      }
    //   } else {
    //      return res.status(403).json({ message: "Access denied: No managed categories assigned." });
    //   }
    // }

    const history = await StatusHistory.find({ grievance: g._id })
      .populate("changedBy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ grievance: g, history });
  } catch (err) {
    console.error("ADMIN GET ONE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Admin – update status
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

// Admin – assign to staff
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

// Attachments (citizen)
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
