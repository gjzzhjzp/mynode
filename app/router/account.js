/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/account/add', controller.account.addAccount);
    router.get('/account/get', controller.account.getAccountList);
    router.get('/account/getStatisticsByfl', controller.account.getStatisticsByfl);
    router.get('/account/getStatisticsByflList', controller.account.getStatisticsByflList);
    router.get('/account/getStatistics', controller.account.getStatistics);
    router.get('/category/get', controller.account.getCategory);
    router.post('/account/update', controller.account.update); // 新增编辑路由
    router.post('/account/delete', controller.account.delete); // 新增删除路由
  };
  
  