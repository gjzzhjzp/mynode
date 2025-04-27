// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');

class UserController extends Controller {
  // 用户初始化进入的时候登录，获取基本信息
  async login() {
    const { ctx } = this;
    const { xcx } = this.config.thirdApi;
    const { code } = ctx.request.body;
    const url = `${xcx.url}/sns/jscode2session?appid=${xcx.appid}&secret=${xcx.secret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const data = await ctx.service.http.get(url);
      const user = await ctx.service.user.loginOrRegister(data.openid);

      const token = this.app.jwt.sign(
        {
          id: user.id,
          username: data.openid,
          openid: data.openid
        },
        this.config.jwt.secret,
        { expiresIn: '2h' }
      );

      ctx.body = ctx.app.common.response.success({
        token,
        userinfo: {
          id: user.id,
          username: data.openid,
          openid: data.openid,
          currency: user.currency || "￥",
        }
      });
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, error.message);
    }
  }
}
module.exports = UserController;
