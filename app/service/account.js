const user = require('../router/user');

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
  async getAccountList({page,rows,openid}) {
    const { ctx } = this;
    const limit = parseInt(rows, 10);  // 确保rows是数字
    const offset = (parseInt(page, 10) - 1) * limit;  // 确保page是数字并计算偏移量
    return await ctx.model.Account.findAll({
      where: { user_openid: openid  },
      order: [['date', 'DESC']],
      limit: limit,
      offset:offset
    });
  }
}

module.exports = AccountService;