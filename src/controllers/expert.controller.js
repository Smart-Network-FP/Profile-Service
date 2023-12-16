const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
module.exports = ({ expertService, elasticService }, { gptController }) => ({
  createExpert: catchAsync(async (req, res) => {
    const expert = await expertService.createExpert(req.body);
    res.status(httpStatus.CREATED).send(expert);
  }),

  getExperts: catchAsync(async (req, res) => {
    const filter = pick(req.query, ['firstName', 'lastName', 'email']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const result = await expertService.queryExperts(filter, options);
    res.send(result);
  }),

  getExpert: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    res.send(expert);
  }),

  updateExpert: catchAsync(async (req, res) => {
    const expert = await expertService.updateExpertById(req.user._id, req.body);
    await elasticService.indexOrUpdateProfile(expert);
    res.send(expert);
  }),

  deleteExpert: catchAsync(async (req, res) => {
    await expertService.deleteExpertById(req.user._id);
    res.status(httpStatus.NO_CONTENT).send();
  }),

  getPersonalInfo: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    personalInfo = await expert.getPersonalInfo();
    console.log('personalInfo', personalInfo);
    res.send(personalInfo);
  }),

  savePersonalInfo: catchAsync(async (req, res) => {
    console.log(expertService);
    const expert = await expertService.updateExpertById(req.user._id, req.body);
    await elasticService.indexOrUpdateProfile(expert);
    res.send(expert);
  }),

  getExperienceInfo: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    experienceInfo = await expert.getExperienceInfo();
    res.send(experienceInfo);
  }),

  saveExperienceInfo: catchAsync(async (req, res) => {
    const expert = await expertService.updateExpertById(req.user._id, req.body);
    const summary = await gptController.promptSummarize(expert);
    const expertSum = await expertService.updateExpertById(req.user._id, { summary });
    await elasticService.indexOrUpdateProfile(expertSum);
    res.send(expert);
  }),

  getExpertiseInfo: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    experienceInfo = await expert.getExpertiseInfo();
    res.send(experienceInfo);
  }),

  saveExpertiseInfo: catchAsync(async (req, res) => {
    const { mySkills } = req.body;
    console.log('mySkills', mySkills);
    const expert = await expertService.updateExpertById(req.user._id, { expertise: mySkills });
    await elasticService.indexOrUpdateProfile(expert);
    res.send(expert);
  }),

  getSummaryInfo: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    await elasticService.indexOrUpdateProfile(expert);
    experienceInfo = await expert.getSummaryInfo();
    res.send(experienceInfo);
  }),

  saveSummaryInfo: catchAsync(async (req, res) => {
    const expert = await expertService.updateExpertById(req.user._id, req.body);
    await elasticService.indexOrUpdateProfile(expert);
    res.send(expert);
  }),

  getProfileInfo: catchAsync(async (req, res) => {
    const expert = await expertService.getExpertById(req.user._id);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    experienceInfo = await expert.getProfileInfo();
    res.send(experienceInfo);
  }),

  getProfileInfoById: catchAsync(async (req, res) => {
    console.log('req.params.expertId', req.params.expertId);
    const expert = await expertService.getExpertById(req.params.expertId);
    if (!expert) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
    }
    experienceInfo = await expert.getProfileInfo();
    res.send(experienceInfo);
  }),

  queryExperts: catchAsync(async (req, res) => {
    const { keyword, filter, options } = req.body;
    const experts = await expertService.queryExpertsSearch(keyword, filter, options);
    if (!experts && !Array.isArray(experts)) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Experts not found');
    }
    // experienceInfo = await expert.getProfileInfo();
    res.send(experts);
  }),
});
