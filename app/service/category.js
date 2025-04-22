const Service = require('egg').Service;

class CategoryService extends Service {
  async getCategoriesByType(type) {
    const { ctx } = this;
    let where = {}
    if (type != undefined) {
      where = { type }
    }
    return await ctx.model.Category.findAll({
      where: where,
      attributes: ['id', 'name', 'type', 'value', 'icon', 'sort_order'],
      order: [['sort_order', 'ASC']]
    });
  }
}

module.exports = CategoryService;