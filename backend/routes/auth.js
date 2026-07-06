// =============================================
// Auth Routes — Register, Login, Verify Email
// =============================================

const express    = require('express');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto     = require('crypto');
const User       = require('../models/User');
const router     = express.Router();

// ── Helper: Generate JWT Token ─────────────
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// ── Helper: Send Email ─────────────────────
const sendEmail = async (to, subject, html) => {
  // Skip email if credentials not configured
  if (!process.env.EMAIL_USER || process.env.EMAIL_USER === 'your_gmail@gmail.com') {
    console.log(`📧 [DEV MODE] Email to ${to}: ${subject}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });
  await transporter.sendMail({ from: `"SkillGap Pro+" <${process.env.EMAIL_USER}>`, to, subject, html });
};

// ── POST /api/auth/register ────────────────
// Creates a new user account
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if email already used
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered. Please login.' });

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create the user (password is auto-hashed by the model)
    const user = await User.create({ name, email, password, verificationToken });

    // Send welcome/verification email
    const verifyUrl = `http://localhost:${process.env.PORT || 5000}/api/auth/verify/${verificationToken}`;
    await sendEmail(email, '✅ Verify your SkillGap Pro+ Account', `
      <div style="font-family:sans-serif;max-width:500px;margin:auto;">
        <h2 style="color:#00cc6a;">Welcome to SkillGap Pro+, ${name}! 🚀</h2>
        <p>Click the button below to verify your email and start your career journey.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#00cc6a;color:#000;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;">Verify Email</a>
        <p style="color:#999;font-size:12px;margin-top:20px;">If you didn't register, ignore this email.</p>
      </div>
    `);

    // Return token so user is auto-logged in
    res.status(201).json({
      message: 'Account created! Check your email to verify.',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── POST /api/auth/login ───────────────────
// Logs in an existing user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No account found with this email.' });

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect password.' });

    res.json({
      message: 'Login successful!',
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// ── GET /api/auth/verify/:token ───────────
// Verifies email when user clicks link in email
router.get('/verify/:token', async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });
    if (!user) return res.status(400).send('<h2>Invalid or expired verification link.</h2>');

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send(`
      <div style="font-family:sans-serif;text-align:center;padding:60px;">
        <h2 style="color:#00cc6a;">✅ Email Verified!</h2>
        <p>Your account is now active. You can close this tab and log in.</p>
      </div>
    `);
  } catch (err) {
    res.status(500).send('<h2>Server error.</h2>');
  }
});

module.exports = router;
