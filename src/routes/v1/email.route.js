const express = require('express');
const router = express.Router();
const auth = require('../../middlewares/auth');

module.exports = ({ emailController }) => {
  router.post('/sendEmail', auth(), emailController.sendEmail);

  return router;
};
