const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  body: Joi.object().keys({
    createdBy: Joi.required().required().custom(objectId),
    title: Joi.string().required(),
    users: Joi.array(),
    meta: Joi.array(),
  }),
};

const getProjectDetailsById = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
};

const getProjectDetailsByUserId = {
  params: Joi.object().keys({
    userId: Joi.string().required().custom(objectId),
  }),
};

const getAllProjects = {
  params: Joi.object().keys({
    createdBy: Joi.required().custom(objectId),
  }),
};

const deleteProjectById = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
  }),
};

const deteteAllProjects = {
  params: Joi.object().keys({
    createdBy: Joi.string().required().custom(objectId),
  }),
};

const updateProjectById = {
  params: Joi.object().keys({
    projectId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    createdBy: Joi.required().required().custom(objectId),
    title: Joi.string(),
    meta: Joi.array(),
  }),
};

const manageMembersToProject = {
  params: Joi.object().keys({
    projectId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    createdBy: Joi.required().required().custom(objectId),
    users: Joi.array(),
  }),
};

const deleteAllMemberFromProject = {
  params: Joi.object().keys({
    createdBy: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createProject,
  updateProjectById,
  getProjectDetailsById,
  getAllProjects,
  deleteProjectById,
  deteteAllProjects,
  manageMembersToProject,
  deleteAllMemberFromProject,
  getProjectDetailsByUserId,
};
