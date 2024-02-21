const Joi = require('joi');
const { objectId } = require('./custom.validation');

const createProject = {
  params: Joi.object().keys({
    managerId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().required(),
    members: Joi.array().required,
  }),
};

const getProjectDetailsById = {
  params: Joi.object().keys({
    projectId: Joi.string().required().custom(objectId),
  }),
};

const getAllProjects = {
  params: Joi.object().keys({
    managerId: Joi.required().custom(objectId),
  }),
};

const deleteProjectById = {
  params: Joi.object().keys({
    managerId: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const deteteAllProjects = {
  params: Joi.object().keys({
    managerId: Joi.string().required().custom(objectId),
  }),
};

const updateProject = {
  params: Joi.object().keys({
    managerId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    name: Joi.string(),
    members: Joi.array(),
    meta: Joi.array(),
  }),
};

const addMemberToProject = {
  params: Joi.object().keys({
    managerId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    memberId: Joi.string().required().custom(objectId),
  }),
};

const deleteMemberFromProject = {
  params: Joi.object().keys({
    managerId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
    memberId: Joi.string().required().custom(objectId),
  }),
};

const deleteAllMemberFromProject = {
  params: Joi.object().keys({
    managerId: Joi.required().required().custom(objectId),
  }),
  body: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

module.exports = {
  createProject,
  updateProject,
  getProjectDetailsById,
  getAllProjects,
  deleteProjectById,
  deteteAllProjects,
  addMemberToProject,
  deleteMemberFromProject,
  deleteAllMemberFromProject,
};
