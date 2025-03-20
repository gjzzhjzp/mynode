/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/account/add', controller.account.addAccount);
    router.get('/account/get', controller.account.getAccountList);
    router.get('/account/getStatisticsByfl', controller.account.getStatisticsByfl);
    router.get('/account/getStatistics', controller.account.getStatistics);
    router.get('/category/get', controller.account.getCategory);
  };
  
  