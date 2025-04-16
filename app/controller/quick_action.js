const Controller = require('egg').Controller;

class QuickActionController extends Controller {
  // 查询快捷功能列表
  async index() {
    const { ctx } = this;
    const { page = 1, rows = 10 } = ctx.query;
    try {
      const { list, total }  =  await ctx.service.quickAction.list(page, rows);
      ctx.body = ctx.app.common.response.success(list, {}, total);
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, '查询快捷功能失败: ' + error.message);
    }
  }
}

module.exports = QuickActionController;