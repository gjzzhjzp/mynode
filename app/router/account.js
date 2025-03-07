/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/account/add', controller.account.addAccount);
    router.get('/category/get', controller.account.getCategory);
  };
  
  