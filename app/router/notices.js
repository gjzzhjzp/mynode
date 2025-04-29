/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/currencies/list', controller.currency.list);
    router.get('/notices/getone', controller.notices.getone);
};

