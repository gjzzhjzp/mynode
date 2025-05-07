const Service = require('egg').Service;

class UserLimitService extends Service {
  async addOrUpdate({ user_openid, daily_limit, monthly_limit, yearly_limit, open_daily, currency }) {
    const { ctx } = this;

    // 查找是否已存在
    const existingLimit = await ctx.model.UserLimit.findOne({
      where: { user_openid }
    });
    ctx.logger.info("existingLimit", existingLimit);
    let parames = {};
    if (typeof daily_limit != "undefined") parames.daily_limit = daily_limit;
    if (typeof monthly_limit != "undefined") parames.monthly_limit = monthly_limit;
    if (typeof yearly_limit != "undefined") parames.yearly_limit = yearly_limit;
    if (typeof open_daily != "undefined") parames.open_daily = open_daily;
    if (typeof currency != "undefined") parames.currency = currency || "￥";
    if (existingLimit) {
      // 更新现有记录
      return await existingLimit.update(parames);
    } else {
      // 创建新记录
      parames.user_openid = user_openid;
      return await ctx.model.UserLimit.create(parames);
    }
  }
  async getByOpenid(openid) {
    const { ctx } = this;
    return await ctx.model.UserLimit.findOne({ where: { user_openid: openid } });
  }
}

module.exports = UserLimitService;