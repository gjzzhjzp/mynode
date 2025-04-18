/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/entertainment/get', controller.entertainment.index);
  };
  
  