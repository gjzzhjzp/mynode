const Service = require('egg').Service;

class EntertainmentService extends Service {
  async queryList({ page, rows, type, status }) {
    const { ctx } = this;
    return await ctx.model.Entertainment.queryList({ page, rows, type, status });
  }
}

module.exports = EntertainmentService;