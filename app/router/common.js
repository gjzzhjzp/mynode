/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/test', controller.home.index);
  router.get('/xcxm', controller.home.xcxm);
  router.post('/common/uploadImage', controller.home.uploadImage);
};

