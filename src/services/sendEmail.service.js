const nodemailer = require('nodemailer');

const sendEmail = async (requestBody) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'timeflare098@gmail.com',
        pass: 'zydr ileh rjfr hptg',
      },
    });

    const mailOptions = {
      from: 'timeflare098@gmail.com',
      to: requestBody.to,
      subject: requestBody.subject,
      text: requestBody.text,
      attachments: [
        {
          filename: requestBody.filename,
          path: requestBody.pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error('Failed to send email');
  }
};

module.exports = {
  sendEmail,
};
