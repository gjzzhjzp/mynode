const Service = require('egg').Service;

class FeedbackService extends Service {
  // 新增反馈
  async create({ openid, content, contact }) {
    const { ctx } = this;
    return await ctx.model.Feedback.create({
      user_openid: openid,
      content,
      contact_info: contact,
      status: 0,
    });
  }

  // 查询用户反馈
  async listByUser(openid, page = 1, rows = 10) {
    const { ctx } = this;
    const result = await ctx.model.Feedback.findAndCountAll({
      where: { user_openid: openid },
      order: [['created_at', 'DESC']],
      offset: (page - 1) * rows,
      limit: rows,
    });
    return {
      list: result.rows,
      total: result.count,
    };
  }
}

module.exports = FeedbackService;