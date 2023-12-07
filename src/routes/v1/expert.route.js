const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const expertValidation = require('../../validations/expert.validation');

const router = express.Router();
module.exports = (elasticClient, services, { expertController }) => {
  router.route('/').get(auth(), validate(expertValidation.getExperts), expertController.getExperts);

  router
    .route('/personal-info')
    .post(auth(), validate(expertValidation.personalInfo), expertController.savePersonalInfo)
    .get(auth(), validate(expertValidation.getPersonalInfo), expertController.getPersonalInfo);
  router
    .route('/experience')
    .post(auth(), validate(expertValidation.experienceInfo), expertController.saveExperienceInfo)
    .get(auth(), validate(expertValidation.getExperienceInfo), expertController.getExperienceInfo);
  router
    .route('/expertise')
    .post(auth(), validate(expertValidation.expertiseInfo), expertController.saveExpertiseInfo)
    .get(auth(), validate(expertValidation.getExpertiseInfo), expertController.getExpertiseInfo);
  router
    .route('/summary')
    .post(auth(), validate(expertValidation.summaryInfo), expertController.saveSummaryInfo)
    .get(auth(), validate(expertValidation.getSummaryInfo), expertController.getSummaryInfo);
  router
    .route('/profile')
    // .post(auth(), validate(expertValidation.summaryInfo), expertController.saveSummaryInfo)
    .get(auth(), validate(expertValidation.getProfileInfo), expertController.getProfileInfo);
  router
    .route('/profileById')
    // .post(auth(), validate(expertValidation.summaryInfo), expertController.saveSummaryInfo)
    .get(auth(), validate(expertValidation.getProfileInfo), expertController.getProfileInfoById);
  router.route('/query').post(auth(), validate(expertValidation.queryExperts), expertController.queryExperts);

  return router;
};
