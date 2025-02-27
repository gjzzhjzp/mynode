// app/service/user.js
const Service = require('egg').Service;

class UserService extends Service {
  async create(user) {
    const { ctx } = this;
    return await ctx.model.User.create(user);
  }
}

module.exports = UserService;
