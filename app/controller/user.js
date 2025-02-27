// app/controller/user.js
const Controller = require('egg').Controller;

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const { username, password } = ctx.request.body;
    console.log("username",username,password);
    const user = await ctx.service.user.create({ username, password });
    ctx.body = user;
  }
  async get() {
    const { ctx } = this;
    console.log("get",ctx.query);
    // const user = await ctx.service.user.get();
    ctx.body = "user";
  }
}

module.exports = UserController;
