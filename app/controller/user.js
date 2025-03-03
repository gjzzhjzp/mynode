// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    console.log("username", username, password);
    const user = await ctx.service.user.create({ username, password });
    ctx.body = user;
  }
  async get() {
    const { ctx } = this;
    console.log("get", ctx.query);
    // const user = await ctx.service.user.get();
    ctx.body = "user";
  }
  async add() {
    const { ctx } = this;
    try {
      const result = await ctx.app.mysql.insert('users', { // 插入到 users 表
        username: "测试1",
        password: "1812345",
      });
      ctx.body = {
        code: 200,
        data: result,
        message: '插入成功',
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '插入失败: ' + error.message,
      };
    }
  }
  async login() {
    const { ctx } = this;
    const {xcx} =this.config.thirdApi;
    const { code } = ctx.request.body;
    const url = `${xcx.url}?appid=${xcx.appid}&secret=${xcx.secret}&js_code=${code}&grant_type=authorization_code`;
    try {
      const data = await ctx.service.http.get(url);
      await ctx.app.mysql.insert('users', { // 插入到 users 表
        // username: "测试124",
        openid: data.openid,
      });
      ctx.app.response.success({
        openid: data.openid,
        username:data.username
      });
    } catch (error) {
      ctx.app.response.error(500,error.message);
    }
  }
}
module.exports = UserController;
