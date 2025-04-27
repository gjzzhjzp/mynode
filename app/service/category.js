const Service = require('egg').Service;

class CategoryService extends Service {
  async getCategoriesByType(type, openid) {
    const { ctx } = this;
    let where = {
      [ctx.app.Sequelize.Op.or]: [
        { user_openid: null },
        { user_openid: openid }
      ]
    }
    if (type != undefined) {
      where.type = type;
    }
    return await ctx.model.Category.findAll({
      where: where,
      attributes: ['id', 'name', 'type', 'value', 'icon', 'sort_order'],
      order: [['sort_order', 'ASC'], ['id', 'ASC']]
    });
  }
  async update(id, openid, payload) {
    const { ctx } = this;
    return await ctx.model.Category.update(payload, {
      where: { id, user_openid: openid }
    });
  }

  async delete(id, openid) {
    const { ctx } = this;
    return await ctx.model.Category.destroy({
      where: { id, user_openid: openid }
    });
  }
}

module.exports = CategoryService;