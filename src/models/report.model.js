const mongoose = require('mongoose');
const { toJSON } = require('./plugins');
const { tokenTypes } = require('../config/tokens');

const reportSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: false,
        },
        projects: {
            type: Array,
            required: false,
        },
        reportUrl: {
            type: String,
            required: true,
        },
        timelogs: {
            type: Array,
            required: true,
        },
        totalHours: {
            type: Number,
            required: false,
        },
        reportType: {
            type: String,
            required: true,
        },
        exportType: {
            type: String,
            required: true,
        },
        remarks: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
reportSchema.plugin(toJSON);


const Report = mongoose.model('Report', reportSchema);

module.exports = Report;