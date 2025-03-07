/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  // const { router, controller } = app;
  // router.get('/', controller.home.index);
  // router.get('/getuser', controller.user.get);
  // router.post('/user', controller.user.create);
  require('./router/common')(app);
  require('./router/user')(app);
  require('./router/account')(app);
};

