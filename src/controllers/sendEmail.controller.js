// const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const MailController = require('../services/sendEmail.service');

const sendEmail = catchAsync(async (req, res) => {
  try {
    await MailController.sendEmail(req.body);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email' });
  }
});

module.exports = {
  sendEmail,
};
