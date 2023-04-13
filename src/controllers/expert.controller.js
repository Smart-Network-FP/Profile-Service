const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { expertService } = require('../services');

const createExpert = catchAsync(async (req, res) => {
  const expert = await expertService.createExpert(req.body);
  res.status(httpStatus.CREATED).send(expert);
});

const getExperts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['firstName', 'lastName', 'email']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await expertService.queryExperts(filter, options);
  res.send(result);
});

const getExpert = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  res.send(expert);
});

const updateExpert = catchAsync(async (req, res) => {
  const expert = await expertService.updateExpertById(req.user._id, req.body);
  res.send(expert);
});

const deleteExpert = catchAsync(async (req, res) => {
  await expertService.deleteExpertById(req.user._id);
  res.status(httpStatus.NO_CONTENT).send();
});

const getPersonalInfo = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  personalInfo = await expert.getPersonalInfo();
  console.log('personalInfo', personalInfo);
  res.send(personalInfo);
});

const savePersonalInfo = catchAsync(async (req, res) => {
  const expert = await expertService.updateExpertById(req.user._id, req.body);
  res.send(expert);
});

const getExperienceInfo = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  experienceInfo = await expert.getExperienceInfo();
  res.send(experienceInfo);
});

const saveExperienceInfo = catchAsync(async (req, res) => {
  const expert = await expertService.updateExpertById(req.user._id, req.body);
  res.send(expert);
});

const getExpertiseInfo = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  experienceInfo = await expert.getExpertiseInfo();
  res.send(experienceInfo);
});

const saveExpertiseInfo = catchAsync(async (req, res) => {
  const expert = await expertService.updateExpertById(req.user._id, req.body);
  res.send(expert);
});

const getSummaryInfo = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  experienceInfo = await expert.getSummaryInfo();
  res.send(experienceInfo);
});

const saveSummaryInfo = catchAsync(async (req, res) => {
  const expert = await expertService.updateExpertById(req.user._id, req.body);
  res.send(expert);
});

const getProfileInfo = catchAsync(async (req, res) => {
  const expert = await expertService.getExpertById(req.user._id);
  if (!expert) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Expert not found');
  }
  experienceInfo = await expert.getProfileInfo();
  res.send(experienceInfo);
});

const queryExperts = catchAsync(async (req, res) => {
  const { keyword, filter, options } = req.body
  const experts = await expertService.queryExpertsSearch(keyword, filter, options);
  if (!experts && !Array.isArray(experts)) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Experts not found');
  }
  // experienceInfo = await expert.getProfileInfo();
  res.send(experts);
});

module.exports = {
  createExpert,
  getExperts,
  getExpert,
  updateExpert,
  deleteExpert,
  savePersonalInfo,
  getPersonalInfo,
  getExperienceInfo,
  saveExperienceInfo,
  getExpertiseInfo,
  saveExpertiseInfo,
  getSummaryInfo,
  saveSummaryInfo,
  getProfileInfo,
  queryExperts
};
