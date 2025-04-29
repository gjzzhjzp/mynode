/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
    const { router, controller } = app;
    router.get('/category/get', controller.category.getCategory);
    router.post('/category/add', controller.category.add);
    router.post('/category/update', controller.category.update);
    router.post('/category/delete', controller.category.delete);

};

