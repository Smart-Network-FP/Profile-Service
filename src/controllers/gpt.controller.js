const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

module.exports = (services) => ({
  promptTokenization: catchAsync(async (req, res) => {
    const parsedDetails = await services.gptService.gptPrompt(req.body.message);
    console.log(parsedDetails);
    res.status(httpStatus.OK).send({
      status: 'OK',
      result: JSON.parse(parsedDetails),
    });
  }),
});
