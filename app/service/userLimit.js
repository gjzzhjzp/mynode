const Service = require('egg').Service;

class UserLimitService extends Service {
  async addOrUpdate({ user_openid, daily_limit, monthly_limit, yearly_limit, open_daily, currency }) {
    const { ctx } = this;

    // 查找是否已存在
    const existingLimit = await ctx.model.UserLimit.findOne({
      where: { user_openid }
    });
    ctx.logger.info("existingLimit", existingLimit);
    if (existingLimit) {
      // 更新现有记录
      return await existingLimit.update({
        daily_limit,
        monthly_limit,
        yearly_limit,
        open_daily,
        currency
      });
    } else {
      // 创建新记录
      return await ctx.model.UserLimit.create({
        user_openid,
        daily_limit,
        monthly_limit,
        yearly_limit,
        open_daily,
        currency
      });
    }
  }
  async getByOpenid(openid) {
    const { ctx } = this;
    return await ctx.model.UserLimit.findOne({ where: { user_openid: openid } });
  }
}

module.exports = UserLimitService;