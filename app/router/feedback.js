/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    // 新增反馈
    router.post('/feedback/add', controller.feedback.create);

    // 查询用户反馈
    router.get('/feedback/get', controller.feedback.index);
};

