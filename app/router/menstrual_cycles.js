/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/menstrual_cycles/get', controller.menstrual_cycles.get);
    router.post('/menstrual_cycles/add', controller.menstrual_cycles.add);
};

