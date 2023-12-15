const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

module.exports = ({ emailService }) => ({
  sendEmail: catchAsync(async (req, res) => {
    const { recipients, subject, message } = req.body;
    const msg = await emailService.sendEmail(recipients, subject, message);
    res.status(httpStatus.OK).send(msg);
  }),
  search: catchAsync(async (req, res) => {
    const { query } = req.body;
    const result = await services.elasticService.searchQuery(query);
    res.status(httpStatus.OK).json(result);
  }),
});
