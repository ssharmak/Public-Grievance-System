import Grievance from "../models/Grievance.js";

// Generate unique grievance ID
const generateGrievanceId = () =>
  "PGS-" +
  Date.now().toString(36).toUpperCase() +
  "-" +
  Math.random().toString(36).substring(2, 6).toUpperCase();

// STATIC CATEGORY LIST (must match frontend)
const VALID_CATEGORIES = [
  "electricity",
  "water",
  "road",
  "sanitation",
  "waste",
  "streetlights",
  "drainage",
  "public-transport",
  "sewage",
  "healthcare",
  "public-safety",
  "other",
];

// ✔ CREATE GRIEVANCE
export const createGrievance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description, categoryId, priority, location, attachments } =
      req.body;

    // Validate category against allowed list
    if (!VALID_CATEGORIES.includes(categoryId)) {
      return res.status(400).json({ message: "Invalid category" });
    }

    const newGrievance = await Grievance.create({
      grievanceId: generateGrievanceId(),
      userId,
      createdBy: {
        name: req.user.name || "",
        email: req.user.email || "",
        primaryContact: req.user.primaryContact || "",
      },
      categoryId, // store string directly
      title,
      description,
      priority,
      location,
      attachments,
    });

    res.status(201).json(newGrievance);
  } catch (err) {
    console.error("CREATE GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✔ GET USER'S OWN GRIEVANCES
export const getMyGrievances = async (req, res) => {
  try {
    const list = await Grievance.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(list);
  } catch (err) {
    console.error("GET MY GRIEVANCES ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✔ GET SINGLE GRIEVANCE
export const getSingleGrievance = async (req, res) => {
  try {
    const found = await Grievance.findOne({
      grievanceId: req.params.id,
      userId: req.user.id,
    });

    if (!found) {
      return res.status(404).json({ message: "Grievance not found" });
    }

    res.json(found);
  } catch (err) {
    console.error("GET SINGLE GRIEVANCE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
