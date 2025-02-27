/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/getuser', controller.user.get);
    router.post('/user', controller.user.create);
  };
  
  