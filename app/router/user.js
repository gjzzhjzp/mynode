/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/getuser', controller.user.get);
    router.get('/adduser', controller.user.add);
    router.post('/user', controller.user.create);
    router.post('/login', controller.user.login);
  };
  
  