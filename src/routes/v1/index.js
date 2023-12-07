const express = require('express');
const authRoute = require('./auth.route');
const expertRoute = require('./expert.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

module.exports = (services, elasticClient, controller) => {
  const elasticSearch = require('./elasticSearch.route')(elasticClient, services, controller);
  const gptRoute = require('./gpt.route')(elasticClient, services, controller);
  const router = express.Router();

  const defaultRoutes = [
    {
      path: '/auth',
      route: authRoute(elasticClient, services, controller),
    },
    {
      path: '/experts',
      route: expertRoute(elasticClient, services, controller),
    },
    {
      path: '/users',
      route: userRoute(elasticClient, services, controller),
    },
    {
      path: '/elastic-search',
      route: elasticSearch,
    },
    {
      path: '/gpt',
      route: gptRoute,
    },
  ];

  const devRoutes = [
    // routes available only in development mode
    //  {
    //  path: '/docs',
    //  route: docsRoute,
    // },
  ];

  defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });

  /* ignore next */
  if (config.env === 'development') {
    devRoutes.forEach((route) => {
      router.use(route.path, route.route);
    });
  }
  return router;
};
