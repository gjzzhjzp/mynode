/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/userLimit/addOrUpdate', controller.userLimit.addOrUpdate);
  };