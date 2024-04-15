const Joi = require('joi');

const sendEmail = {
  body: Joi.object().keys({
    to: Joi.string().required(),
    subject: Joi.string().required(),
    text: Joi.string().required(),
    filename: Joi.string().required(),
    pdfPath: Joi.string().required(),
  }),
};

module.exports = {
  sendEmail,
};
