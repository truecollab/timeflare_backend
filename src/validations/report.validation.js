const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getReport = {
    body: Joi.object().keys({
        exportType: Joi.string().required(),
        reportType: Joi.string().required(),
        startTime: Joi.date().required(),
        endTime: Joi.date().required(),
        projects: Joi.array().required(),
        
    }),
    };
module.exports = {
    getReport,
};