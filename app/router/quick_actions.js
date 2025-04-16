/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/quick_actions/get', controller.quickAction.index);
};

