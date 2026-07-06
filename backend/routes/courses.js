const router  = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const Course  = require("../models/Course");

// ── GET /api/courses  (public) ──────────────────────────
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/courses/:name ──────────────────────────────
router.get("/:name", async (req, res) => {
  try {
    const course = await Course.findOne({ name: req.params.name });
    if (!course) return res.status(404).json({ message: "Course not found" });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/courses  (admin only) ────────────────────
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { name, icon, description, skills } = req.body;
    if (!name || !skills?.length)
      return res.status(400).json({ message: "Name and skills are required" });

    const exists = await Course.findOne({ name });
    if (exists) return res.status(400).json({ message: "Course already exists" });

    const course = await Course.create({ name, icon: icon || "📚", desc: description || "", skills });
    res.status(201).json({ message: "Course created", course });
  } catch (err) {
    res.status(500).json({ message: "Server error: " + err.message });
  }
});

// ── DELETE /api/courses/:id  (admin only) ───────────────
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: "Course deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/courses/:id  (admin only) ──────────────────
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Course updated", course });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
