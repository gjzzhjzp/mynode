const Controller = require('egg').Controller;

class FeedbackController extends Controller {
  // 新增反馈
  async create() {
    const { ctx } = this;
    const { openid, content, contact } = ctx.request.body;

    try {
      const feedback = await ctx.service.feedback.create({ openid, content, contact });
      ctx.body = { code: 200, data: feedback };
    } catch (error) {
      ctx.body = { code: 500, message: '提交失败' };
    }
  }

  // 查询用户反馈
  async index() {
    const { ctx } = this;
    const { openid } = ctx.query;
    const { page = 1, rows = 10 } = ctx.query;

    try {
      const result = await ctx.service.feedback.listByUser(openid, page, rows);
      ctx.body = { code: 200, data: result };
    } catch (error) {
      ctx.body = { code: 500, message: '查询失败' };
    }
  }
}

module.exports = FeedbackController;