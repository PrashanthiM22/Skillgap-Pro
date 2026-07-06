const router  = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const User    = require("../models/User");

router.use(protect);

// ── GET /api/user/profile ───────────────────────────────
router.get("/profile", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    // Return flat shape the frontend expects
    res.json({
      selectedCourse:  user.selectedCourse,
      selectedSkills:  user.skills,
      analysisPercent: user.analysisPercent,
      resumeData:      { ...user.resume.toObject(), name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/user/all  (admin only) ────────────────────
router.get("/all", adminOnly, async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/user/skills ────────────────────────────────
router.put("/skills", async (req, res) => {
  try {
    const { selectedCourse, selectedSkills, analysisPercent } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      selectedCourse,
      skills: selectedSkills,
      analysisPercent,
    });
    res.json({ message: "Skills saved ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── PUT /api/user/resume ────────────────────────────────
router.put("/resume", async (req, res) => {
  try {
    const { projects, ...rest } = req.body;
    await User.findByIdAndUpdate(req.user._id, {
      "resume.title":        rest.title        || "",
      "resume.phone":        rest.phone        || "",
      "resume.linkedin":     rest.linkedin     || "",
      "resume.github":       rest.github       || "",
      "resume.degree":       rest.degree       || "",
      "resume.university":   rest.university   || "",
      "resume.year":         rest.year         || "",
      "resume.cgpa":         rest.cgpa         || "",
      "resume.summary":      rest.summary      || "",
      "resume.extraSkills":  rest.extraSkills  || "",
      "resume.achievements": rest.achievements || "",
      "resume.projects":     projects          || [],
    });
    res.json({ message: "Resume saved ✅" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
