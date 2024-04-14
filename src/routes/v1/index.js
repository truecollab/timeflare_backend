const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const projectRoute = require('./project.route');
const timelogRoute = require('./timelog.route');
const config = require('../../config/config');
const sendEmailRoute = require('./sendEmail.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/project',
    route: projectRoute,
  },
  {
    path: '/timelog',
    route: timelogRoute,
  },
  {
    path: '/send-email',
    route: sendEmailRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
