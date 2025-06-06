/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/menstrualSetting/add', controller.menstrualSetting.add)
    router.get('/menstrualSetting/get', controller.menstrualSetting.get)
};

