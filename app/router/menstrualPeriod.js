/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/menstrualPeriod/add', controller.menstrualPeriod.add);
    router.get('/menstrualPeriod/getMonthlyRecords', controller.menstrualPeriod.getMonthlyRecords);
};

