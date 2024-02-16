const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const timelogSchema = mongoose.Schema(
  {
    start_time: {
      type: Date,
      required: true,
    },
    end_time: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    project_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    user_id: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    created_date: {
      type: Date,
      required: true,
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
