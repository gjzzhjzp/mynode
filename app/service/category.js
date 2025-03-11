const Service = require('egg').Service;

class CategoryService extends Service {
  async getCategoriesByType(type) {
    const { ctx } = this;
    if (![0, 1].includes(type)) {
      ctx.throw(400, 'Invalid category type');
    }
    return await ctx.model.Category.findAll({
      where: { type },
      attributes: ['id', 'name', 'type', 'value', 'icon']
    });
  }
}

module.exports = CategoryService;