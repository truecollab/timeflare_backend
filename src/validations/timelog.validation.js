const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createTimelog = {
  body: Joi.object().keys({
    startTime: Joi.date().required(),
    endTime: Joi.date().required(),
    createdBy: Joi.required().required().custom(objectId),
    projectId: Joi.required().required().custom(objectId),
    description: Joi.string().required(),
    remarks: Joi.array(),
    isEditable: true,
  }),
};

const getTimelogById = {
  params: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    timelogId: Joi.required().required().custom(objectId),
  }),
};

const getAllTimelog = {
  params: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
  }),
};

const updateTimelogById = {
  params: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
    timelogId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    startTime: Joi.date(),
    endTime: Joi.date(),
    description: Joi.string(),
    remarks: Joi.array(),
  }),
};

const deleteTimelogById = {
  params: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
    timelogId: Joi.required().required().custom(objectId),
  }),
};
/**
 * Query for users
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */

const getTimelog = {
  params: Joi.object().keys({
    createdBy: Joi.string(),
  }),
  query: Joi.object().keys({
    projectId: Joi.required().custom(objectId),
    startTime: Joi.date(),
    endTime: Joi.date(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getTimelogByProjectId = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createTimelog,
  getTimelog,
  getTimelogById,
  getAllTimelog,
  updateTimelogById,
  deleteTimelogById,
  getTimelogByProjectId,
};
