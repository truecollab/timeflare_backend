const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const projectSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    users: {
      type: Array,
      required: true,
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
projectSchema.plugin(toJSON);
projectSchema.plugin(paginate);

/**
 * @typedef Project
 */
const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
