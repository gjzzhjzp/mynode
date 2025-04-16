const user = require('../router/user');

const Service = require('egg').Service;

class AccountService extends Service {
  // 新增方法：检查额度
  async checkLimits(user_openid, amount) {
    const { ctx } = this;
    const userLimit = await ctx.model.UserLimit.findOne({
      where: { user_openid }
    });

    if (!userLimit) return;

    // 检查每日额度
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);
    ctx.logger.info("检查每日额度", todayStart, todayEnd);
    const todaySpent = await ctx.model.Account.sum('amount', {
      where: {
        user_openid,
        type: 0,
        date: { [ctx.app.Sequelize.Op.between]: [todayStart, todayEnd] }
      }
    });

    if (todaySpent > userLimit.daily_limit) {
      await ctx.service.wechat.sendOverLimitNotification(user_openid, 'daily', userLimit.daily_limit, todaySpent);
    }

    // 检查每月额度
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    monthEnd.setHours(23, 59, 59, 999);

    const monthSpent = await ctx.model.Account.sum('amount', {
      where: {
        user_openid,
        type: 0,
        date: { [ctx.app.Sequelize.Op.between]: [monthStart, monthEnd] }
      }
    });

    if (monthSpent > userLimit.monthly_limit) {
      await ctx.service.wechat.sendOverLimitNotification(user_openid, 'monthly', userLimit.monthly_limit, monthSpent);
    }

    // 检查每年额度
    const yearStart = new Date();
    yearStart.setMonth(0);
    yearStart.setDate(1);
    yearStart.setHours(0, 0, 0, 0);
    const yearEnd = new Date(yearStart.getFullYear(), 11, 31);
    yearEnd.setHours(23, 59, 59, 999);

    const yearSpent = await ctx.model.Account.sum('amount', {
      where: {
        user_openid,
        type: 0,
        date: { [ctx.app.Sequelize.Op.between]: [yearStart, yearEnd] }
      }
    });

    if (yearSpent > userLimit.yearly_limit) {
      await ctx.service.wechat.sendOverLimitNotification(user_openid, 'yearly', userLimit.yearly_limit, yearSpent);
    }
  }
  async createAccount(data) {
    const { ctx } = this;
    // 参数校验
    if (!data.amount || data.type === undefined || !data.category || !data.date) {
      ctx.throw(400, '缺少必要参数');
    }
    let createResult = await ctx.model.Account.create(data);
    // 检查额度
    this.checkLimits(data.user_openid, data.amount);
    return createResult
  }
  async getAccountList({ page, rows, openid, order, id }) {
    const { ctx } = this;
    const limit = parseInt(rows, 10);  // 确保rows是数字
    const offset = (parseInt(page, 10) - 1) * limit;  // 确保page是数字并计算偏移量
    if (id) {
      return {
        list: [await ctx.model.Account.findOne({
          where: {
            id,
            user_openid: openid
          }
        })],
        total: 1
      };
    }
    const result = await ctx.model.Account.findAndCountAll({
      where: { user_openid: openid },
      order: order || [['created_at', 'DESC']],  // 默认按创建时间降序排列
      limit: limit,
      offset: offset
    });
    return {
      list: result.rows,
      total: result.count
    };
  }
  // 账单统计
  async getStatisticsByfl({
    openid,
    type = 'day',
    startDate,
    endDate
  }) {
    const { ctx } = this;

    return await ctx.model.Account.getStatisticsByfl({
      openid,
      type,
      startDate,
      endDate
    });
  }
  async getStatistics({
    openid,
    startDate = new Date(),
    endDate = new Date()
  }) {
    const { ctx } = this;

    return await ctx.model.Account.getStatistics({
      openid,
      startDate,
      endDate
    });
  }
  // 新增编辑服务
  async update(id, payload) {
    const { ctx } = this;
    const openid = ctx.state.user.openid;
    return await ctx.model.Account.updateById(id, openid, payload);
  }
  // 新增删除服务
  async delete(id) {
    const { ctx } = this;
    const openid = ctx.state.user.openid;
    return await ctx.model.Account.deleteById(id, openid);
  }
}

module.exports = AccountService;