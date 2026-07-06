const router  = require("express").Router();
const { protect, adminOnly } = require("../middleware/auth");
const User    = require("../models/User");
const Course  = require("../models/Course");

router.use(protect, adminOnly);

// ── GET /api/admin/stats ────────────────────────────────
router.get("/stats", async (req, res) => {
  try {
    const totalUsers   = await User.countDocuments({ role: "user" });
    const totalCourses = await Course.countDocuments();

    const recentUsers = await User.find({ role: "user" })
      .sort({ createdAt: -1 }).limit(10)
      .select("name email selectedCourse analysisPercent createdAt");

    const scoreAgg = await User.aggregate([
      { $match: { role: "user", analysisPercent: { $gt: 0 } } },
      { $group: { _id: null, avg: { $avg: "$analysisPercent" } } }
    ]);
    const avgScore = scoreAgg.length ? Math.round(scoreAgg[0].avg) : 0;

    const coursePop = await User.aggregate([
      { $match: { selectedCourse: { $ne: "" } } },
      { $group: { _id: "$selectedCourse", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.json({ totalUsers, totalCourses, avgScore, recentUsers, coursePop });
  } catch (err) {
    console.error("Stats error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET /api/admin/users ────────────────────────────────
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── DELETE /api/admin/user/:id ──────────────────────────
router.delete("/user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ── POST /api/admin/notify ──────────────────────────────
router.post("/notify", async (req, res) => {
  try {
    const { subject, message, targetEmail } = req.body;
    if (!subject || !message)
      return res.status(400).json({ message: "Subject and message required" });

    const hasEmail =
      process.env.EMAIL_USER &&
      process.env.EMAIL_USER !== "your_gmail@gmail.com" &&
      process.env.EMAIL_PASS &&
      process.env.EMAIL_PASS !== "your_app_password_here";

    if (hasEmail) {
      const nodemailer = require("nodemailer");
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
      let recipients = targetEmail
        ? [targetEmail]
        : (await User.find({ role: "user" }).select("email")).map((u) => u.email);

      for (const to of recipients) {
        await transporter.sendMail({
          from: `"SkillGap Pro+" <${process.env.EMAIL_USER}>`,
          to, subject,
          html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px;">
            <h2 style="color:#00cc6a;">SkillGap Pro+</h2>
            <p style="line-height:1.7;">${message.replace(/\n/g, "<br>")}</p>
            <hr style="margin:20px 0;border-color:#eee;">
            <p style="font-size:12px;color:#aaa;">SkillGap Pro+ · AI Career Platform</p>
          </div>`,
        });
      }
      res.json({ message: `✅ Email sent to ${recipients.length} recipient(s)` });
    } else {
      console.log("📧 NOTIFICATION (email not configured):", { subject, message, targetEmail });
      res.json({ message: "⚠️ Email not configured in .env — message logged to console only." });
    }
  } catch (err) {
    console.error("Notify error:", err);
    res.status(500).json({ message: "Error: " + err.message });
  }
});

module.exports = router;
