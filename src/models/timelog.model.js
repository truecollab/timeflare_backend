const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const timelogSchema = mongoose.Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    createdBy: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    remarks: {
      type: Array,
    },
    title: {
      type: String,
      required: true,
    },
    isEditable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
timelogSchema.plugin(toJSON);

/**
 * @typedef Timelog
 */
const Timelog = mongoose.model('Timelog', timelogSchema);

module.exports = Timelog;
