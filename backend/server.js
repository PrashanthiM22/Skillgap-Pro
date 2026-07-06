// =============================================
// SkillGap Pro+ — Main Server File (FIXED)
// =============================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ── MIDDLEWARE ─────────────────────────────
app.use(express.json());

app.use(cors({
  origin: true,
  credentials: true
}));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// ── ROUTES ─────────────────────────────────
const authRoutes    = require('./routes/auth');
const userRoutes    = require('./routes/user');
const courseRoutes  = require('./routes/courses');
const adminRoutes   = require('./routes/admin');

app.use('/api/auth',    authRoutes);
app.use('/api/user',    userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/admin',   adminRoutes);

// ── FIXED ROUTE (IMPORTANT 🔥) ─────────────
// ❌ DO NOT USE app.get('*')
// ✅ Use app.use instead
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ── CONNECT TO MONGODB ─────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully!');

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Admin Panel: http://localhost:${PORT}/admin.html`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Failed:', err.message);
    console.log('👉 Check your MONGODB_URI in .env');
  });