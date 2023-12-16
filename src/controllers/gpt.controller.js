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
  promptSummarizeRequest: catchAsync(async (req, res) => {
    const { expert } = req.body;
    const gptMessage = `Using the below profile object information as a basis, please create a comprehensive and professional summary of maximum 200 words. Assume and predict additional skills, expertise, and professional achievements that might align with the profile's background, focusing on a narrative that portrays a well-rounded and accomplished individual in the the given industry. The summary should look genuine and reflect a realistic career progression:
    \n
    ${JSON.stringify(expert)}
    \n
    Please include a narrative about the person's career journey, key projects, leadership experiences, professional skills, and personal attributes that would be relevant in the the given industry and roles like mentioned in the object. The summary should be engaging, professional, and suitable for a high-level executive profile.`;
    console.log(gptMessage);
    const summary = await services.gptService.gptPrompt(gptMessage);
    console.log('GPT summary', summary);
    res.status(httpStatus.OK).send({
      status: 'OK',
      result: summary,
    });
  }),
  promptSummarize: async (expert) => {
    const gptMessage = `Using the below profile object information as a basis, please create a comprehensive and professional summary of maximum 200 words. Assume and predict additional skills, expertise, and professional achievements that might align with the profile's background, focusing on a narrative that portrays a well-rounded and accomplished individual in the the given industry. The summary should look genuine and reflect a realistic career progression:
    \n
    ${JSON.stringify(expert)}
    \n
    Please include a narrative about the person's career journey, key projects, leadership experiences, professional skills, and personal attributes that would be relevant in the the given industry and roles like mentioned in the object. The summary should be engaging, professional, and suitable for a high-level executive profile.`;
    console.log(gptMessage);
    const summary = await services.gptService.gptPrompt(gptMessage);
    console.log('GPT summary', summary);
    return summary;
  },
});
