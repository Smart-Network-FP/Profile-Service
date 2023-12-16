const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

module.exports = ({ emailService }) => ({
  sendEmail: catchAsync(async (req, res) => {
    const { recipients, subject, message } = req.body;
    const msg = await emailService.sendEmail(recipients, subject, message);
    res.status(httpStatus.OK).send(msg);
  }),
  sendEmailHtml: catchAsync(async (req, res) => {
    const { recipients, subject, message } = req.body;
    const msg = await emailService.sendEmailHtml(recipients, subject, message);
    res.status(httpStatus.OK).send(msg);
  }),
});
