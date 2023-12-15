module.exports = (esClient, models, openAIApi) => {
  const services = {};

  services.emailService = require('./email.service-old')();
  services.userService = require('./user.service')(models);
  services.expertService = require('./expert.service')(models);
  services.elasticService = require('./elastic.service')(esClient);
  services.gptService = require('./gpt.service')(openAIApi);
  services.tokenService = require('./token.service')(models, services);
  services.authService = require('./auth.service')(models, services);
  services.emailService = require('./email.service')();

  return services;
};