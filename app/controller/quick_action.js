const Controller = require('egg').Controller;

class QuickActionController extends Controller {
  // 查询快捷功能列表
  async index() {
    const { ctx } = this;
    const { page = 1, pageSize = 10 } = ctx.query;

    try {
      const result = await ctx.service.quickAction.list(page, pageSize);
      ctx.body = { code: 200, data: result };
    } catch (error) {
      ctx.body = { code: 500, message: '查询失败' };
    }
  }
}

module.exports = QuickActionController;