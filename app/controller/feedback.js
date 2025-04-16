const Controller = require('egg').Controller;

class FeedbackController extends Controller {
  // 新增反馈
  async create() {
    const { ctx } = this;
    const { content, contact = "" } = ctx.request.body;
    const openid = ctx.state.user.openid;
    try {
      const result = await ctx.service.feedback.create({ openid, content, contact });

      ctx.body = ctx.app.common.response.success({
        id: result.id
      });
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, '添加意见反馈失败: ' + error.message);
    }
  }

  // 查询用户反馈
  async index() {
    const { ctx } = this;
    const { page = 1, rows = 10 } = ctx.query;

    try {
      const { list, total } = await ctx.service.feedback.listByUser(page, rows);
      ctx.body = ctx.app.common.response.success(list, {}, total);
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, '查询意见反馈失败: ' + error.message);
    }
  }
}

module.exports = FeedbackController;