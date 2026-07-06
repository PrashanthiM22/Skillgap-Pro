// =============================================
// User Model — What a user looks like in DB
// =============================================
// Think of this as a "form template" for MongoDB.
// Every user saved will follow this structure.

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs'); // For hashing passwords

const UserSchema = new mongoose.Schema({
  // Basic Info
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  avatar:   { type: String, default: '' },

  // Role: 'user' = normal student, 'admin' = can manage courses
  role: { type: String, enum: ['user', 'admin'], default: 'user' },

  // Email verification
  isVerified:        { type: Boolean, default: false },
  verificationToken: { type: String },

  // Skills & Course Data (synced from frontend)
  selectedCourse: { type: String, default: '' },
  selectedSkills: { type: [String], default: [] },
  analysisPercent:{ type: Number, default: 0 },

  // Resume data
  resumeData: {
    name:         String,
    title:        String,
    email:        String,
    phone:        String,
    linkedin:     String,
    github:       String,
    degree:       String,
    university:   String,
    year:         String,
    cgpa:         String,
    summary:      String,
    extraSkills:  String,
    achievements: String,
    projects: [{
      title: String,
      tech:  String,
      desc:  String
    }]
  },

  // Timestamps — automatically added by Mongoose
}, { timestamps: true });

// ── HASH PASSWORD BEFORE SAVING ────────────
// This runs automatically before every save()
// It converts "mypassword123" → "$2a$10$xyz..." (unreadable hash)
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if password changed
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ── METHOD: Compare Password ───────────────
// Used during login to check if typed password matches stored hash
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
