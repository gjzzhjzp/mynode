const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.wechat.sendOverLimitNotification("o5DNf7Kcd5UqkNq_5pj7lb1Hc7Mw");
    ctx.body = 'hi, egg'+JSON.stringify(result);
  }
}

module.exports = HomeController;
