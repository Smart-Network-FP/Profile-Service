const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

module.exports = ({ emailController }) => {
  router.post('/sendEmail', auth(), emailController.sendEmail);
  router.post('/sendEmailHtml', auth(), emailController.sendEmailHtml);

  return router;
};
