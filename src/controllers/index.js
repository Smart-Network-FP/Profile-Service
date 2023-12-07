// module.exports.authController = require('./auth.controller');
// module.exports.userController = require('./user.controller');
// module.exports.expertController = require('./expert.controller');

module.exports = (client, services) => ({
  authController: require('./auth.controller')(services),
  userController: require('./user.controller')(services),
  expertController: require('./expert.controller')(services),
  elasticController: require('./elastic.controller')(client, services),
  gptController: require('./gpt.controller')(services),
});
