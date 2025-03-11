const Service = require('egg').Service;

class AccountService extends Service {
  async createAccount(data) {
    const { ctx } = this;
    // 参数校验
    if (!data.amount || data.type === undefined || !data.category || !data.date) {
      ctx.throw(400, '缺少必要参数');
    }
    return await ctx.model.Account.create(data);
  }
}

module.exports = AccountService;