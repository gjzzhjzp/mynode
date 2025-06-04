/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.post('/menstrual/add', controller.menstrualDailyRecords.add)
    router.get('/menstrual/getByDate', controller.menstrualDailyRecords.getByDate)
};

