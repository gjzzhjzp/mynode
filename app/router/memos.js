/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/memos/add', controller.memo.create);

    router.get('/memos/list', controller.memo.getList); // 新增查询路由
    router.post('/memos/delete', controller.memo.delete); // 新增删除路由
    router.post('/memos/update', controller.memo.update); // 更新
};

