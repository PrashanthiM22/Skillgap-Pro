// =============================================
// Course Model — Admin-managed courses in DB
// =============================================

const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name:        { type: String, required: true, unique: true },
  icon:        { type: String, default: '📚' },
  description: { type: String, required: true },
  skills:      { type: [String], required: true },

  // Resources per skill: { "React": { yt: "...", gfg: "...", project: "..." } }
  resources: { type: Map, of: Object, default: {} },

  isActive: { type: Boolean, default: true }, // Admin can hide a course

}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);
