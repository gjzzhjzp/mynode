const Controller = require('egg').Controller;

class EntertainmentController extends Controller {
  async index() {
    const { ctx } = this;
    const { page = 1, rows = 10, type, status } = ctx.query;

    try {
      const { list, total } = await ctx.service.entertainment.queryList({ page, rows, type, status });
      ctx.body = ctx.app.common.response.success(list, {}, total);
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, '查询娱乐项目失败: ' + error.message);
    }
  }
}

module.exports = EntertainmentController;