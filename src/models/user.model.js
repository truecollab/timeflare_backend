const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('./plugins');
const { roles } = require('../config/roles');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isManager: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    managedProjects: {
      type: [], // Assuming managedProjects are referencing other documents
      ref: 'Project', // Assuming managedProjects refer to documents in a 'Project' collection
    },
    projects: {
      type: [], // Assuming projects are referencing other documents
      ref: 'Project', // Assuming projects refer to documents in a 'Project' collection
      default: [], // Set the default value as an empty array
    },
    avatar: {
      type: String,
      default: '/assets/avatars/photo.png', // Assuming a default avatar path
    },
    city: {
      type: String,
    },
    country: {
      type: String,
    },
    jobTitle: {
      type: String,
    },
    timezone: {
      type: String,
    },
    meta: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);


// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // Add the user ID to the projects array if it's not already included
  // if (!this.projects.includes(this.id)) {
  //   this.projects.unshift(this.id); // Add the user ID as the first element
  // }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
