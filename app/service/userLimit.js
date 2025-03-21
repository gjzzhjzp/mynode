const Service = require('egg').Service;

class UserLimitService extends Service {
  async addOrUpdate({ user_openid, daily_limit, monthly_limit, yearly_limit }) {
    const { ctx } = this;
    
    // 查找是否已存在
    const existingLimit = await ctx.model.UserLimit.findOne({
      where: { user_openid }
    });

    if (existingLimit) {
      // 更新现有记录
      return await existingLimit.update({
        daily_limit,
        monthly_limit,
        yearly_limit
      });
    } else {
      // 创建新记录
      return await ctx.model.UserLimit.create({
        user_openid,
        daily_limit,
        monthly_limit,
        yearly_limit
      });
    }
  }
}

module.exports = UserLimitService;