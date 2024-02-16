const Joi = require('joi');

const createProject = {
  body: Joi.object().keys(),
};

module.exports = {
  createProject,
};
