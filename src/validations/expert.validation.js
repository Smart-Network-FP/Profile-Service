const Joi = require('joi');
const { objectId } = require('./custom.validation');

const getExperts = {
  query: Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const personalInfo = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    industry: Joi.string().required(),
    country: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    language: Joi.string().required(),
  }),
};

const experienceInfo = {
  body: Joi.object().keys({
    experience: Joi.array().items(
      Joi.object({
        id: Joi.string().required(),
        role: Joi.string().required(),
        startDate: Joi.string().required(),
        endDate: Joi.string().required(),
        company: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required(),
      })
    ),
  }),
};

const expertiseInfo = {
  body: Joi.object().keys({
    mySkills: Joi.array()
      .items(
        Joi.object({
          id: Joi.string().required(),
          skill: Joi.string().required(),
          level: Joi.string().required(),
          years: Joi.string().required(),
        })
      )
      .required(),
    // Include other fields if needed, e.g., country, company, description
    // country: Joi.string().required(),
    // company: Joi.string().required(),
    // description: Joi.string().required(),
  }),
};

const summaryInfo = {
  body: Joi.object().keys({
    summary: Joi.string().required(),
  }),
};

const getPersonalInfo = {
  params: Joi.object().keys({
    expertId: Joi.string().custom(objectId),
  }),
};

const getExperienceInfo = {
  params: Joi.object().keys({
    expertId: Joi.string().custom(objectId),
  }),
};

const getExpertiseInfo = {
  params: Joi.object().keys({
    expertId: Joi.string().custom(objectId),
  }),
};

const getSummaryInfo = {
  params: Joi.object().keys({
    expertId: Joi.string().custom(objectId),
  }),
};

const getProfileInfo = {
  params: Joi.object().keys({
    expertId: Joi.string().custom(objectId),
  }),
};

const queryExperts = {
  body: Joi.object().keys({
    keyword: Joi.string().allow(''),
    filter: Joi.object(),
    options: Joi.object(),
  }),
};

module.exports = {
  personalInfo,
  getPersonalInfo,
  experienceInfo,
  getExperienceInfo,
  expertiseInfo,
  getExpertiseInfo,
  summaryInfo,
  getSummaryInfo,
  getProfileInfo,
  getExperts,
  queryExperts,
};
