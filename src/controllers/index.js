// module.exports.authController = require('./auth.controller');
// module.exports.userController = require('./user.controller');
// module.exports.expertController = require('./expert.controller');

module.exports = (client, services) => {
  const controller = {};

  controller.authController = require('./auth.controller')(services);
  controller.userController = require('./user.controller')(services);
  controller.elasticController = require('./elastic.controller')(client, services);
  controller.gptController = require('./gpt.controller')(services);
  controller.expertController = require('./expert.controller')(services, controller);
  controller.emailController = require('./email.controller')(services);

  return controller;
};
