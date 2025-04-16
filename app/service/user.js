const Service = require('egg').Service;

class UserService extends Service {
  async loginOrRegister(openid) {
    const { ctx } = this;
    let user = await ctx.model.User.findOne({ where: { openid } });
    if (user) {
      // 更新用户名
      user = await user.update({ username: openid + Math.random() });
    } else {
      ctx.logger.info("openid",openid);
      // 创建新用户
      user = await ctx.model.User.create({
        username: openid + Math.random(),
        openid
      });
    }
    
    return user;
  }
}

module.exports = UserService;