const Service = require('egg').Service;

class QuickActionService extends Service {
  // 查询快捷功能列表
  async list(page = 1, rows = 10) {
    const { ctx } = this;
    const result = await ctx.model.QuickAction.findAndCountAll({
      // where: { status: 1 },
      order: [['sort_order', 'ASC']],
      offset: (page - 1) * rows,
      limit: rows,
    });
    return {
      list: result.rows,
      total: result.count,
    };
  }
}

module.exports = QuickActionService;