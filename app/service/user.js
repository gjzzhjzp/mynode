const Service = require('egg').Service;

class UserService extends Service {
  async loginOrRegister(openid) {
    const { ctx } = this;
    let user = await ctx.model.User.findOne({
      where: { openid }
    });
    if (user) {
      // 更新用户名
      user = await user.update({ username: openid + "_" + new Date().getTime() });
      // 查询 user_limits 表
      const userLimit = await ctx.model.UserLimit.findOne({
        where: { user_openid: openid },
        attributes: ['currency']
      });
      if (userLimit) {
        user.currency = userLimit.currency;
      }
    } else {
      ctx.logger.info("openid", openid);
      // 创建新用户
      user = await ctx.model.User.create({
        username: openid + "_" + new Date().getTime(),
        openid
      });
    }

    return user;
  }
}

module.exports = UserService;