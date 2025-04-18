const user = require('../router/user');

const Service = require('egg').Service;

class AccountService extends Service {
    /**
   * 根据输入参数生成查询的起始和结束日期。
   * @param {{year: number, month: number, day: number, startDate: string|Date, endDate: string|Date}} params - 输入参数对象
   * @param {number} [params.year] - 年份，用于按年或月查询
   * @param {number} [params.month] - 月份（1-12），用于按月或日查询
   * @param {number} [params.day] - 日期（1-31），用于按日查询
   * @param {string|Date} [params.startDate] - 自定义起始日期字符串或Date对象
   * @param {string|Date} [params.endDate] - 自定义结束日期字符串或Date对象
   * @returns {{queryStartDate: Date, queryEndDate: Date}} 返回包含查询起始和结束日期的对象
   */
  getQueryStartEnd({year,month, day, startDate, endDate}) {
    const { ctx } = this;
    let queryStartDate, queryEndDate;
    if (year && month&&day) {
      console.log("day", year, month, day);
      // 按日查询
      queryStartDate = new Date(year, month-1, day);
      queryEndDate = new Date(year, month-1, day);
      queryEndDate.setHours(23, 59, 59, 999);
    }else
    if (year && month) {
      console.log("month", year, month, day);
      // 按月查询
      queryStartDate = new Date(year, month - 1, 1);
      queryEndDate = new Date(year, month, 0);
    } else if (year) {
      console.log("year", year, month, day);
      // 按年查询
      queryStartDate = new Date(year, 0, 1);
      queryEndDate = new Date(year, 11, 31);
    }   else {
      // 默认按天查询
      queryStartDate = startDate ? new Date(startDate) : new Date();
      queryEndDate = endDate ? new Date(endDate) : new Date();
    }
    return {
      queryStartDate,
      queryEndDate,
    }
  }
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
  async getStatisticsByflList({ openid, startDate, endDate, page = 1, rows = 10 }) {
    const { ctx } = this;
    const where = { user_openid: openid };
  
    if (startDate && endDate) {
      where.date = { [ctx.app.Sequelize.Op.between]: [startDate, endDate] };
    }
  
    const limit = parseInt(rows, 10);  // 确保 rows 是数字
    const offset = (parseInt(page, 10) - 1) * limit;  // 计算偏移量
  
    const list = await ctx.model.Account.findAll({
      where,
      order: [['date', 'DESC']],
      limit,
      offset
    });
  
    const total = await ctx.model.Account.count({ where });
  
    return { list, total };
  }
  async getStatistics({ openid, type, startDate, endDate }) {
    const { ctx } = this;
    const where = { user_openid: openid };
  
    if (startDate && endDate) {
      where.date = { [ctx.app.Sequelize.Op.between]: [startDate, endDate] };
    }
  
    const result = await ctx.model.Account.findAll({
      where,
      attributes: [
        [ctx.app.Sequelize.fn('DATE_FORMAT', ctx.app.Sequelize.col('date'), type === 'year' ? '%Y' : type === 'month' ? '%Y-%m' : '%Y-%m-%d'), 'date'],
        'type',
        [ctx.app.Sequelize.fn('SUM', ctx.app.Sequelize.col('amount')), 'total']
      ],
      group: [
        ctx.app.Sequelize.fn('DATE_FORMAT', ctx.app.Sequelize.col('date'), type === 'year' ? '%Y' : type === 'month' ? '%Y-%m' : '%Y-%m-%d'),
        'type'
      ],
      order: [[ctx.app.Sequelize.fn('DATE_FORMAT', ctx.app.Sequelize.col('date'), type === 'year' ? '%Y' : type === 'month' ? '%Y-%m' : '%Y-%m-%d'), 'DESC']]
    });
  
    // 按日期分组，区分收入和支出
    const groupedResult = result.reduce((acc, item) => {
      const date = item.dataValues.date;
      const type = item.dataValues.type;
      const total = item.dataValues.total;
  
      if (!acc[date]) {
        acc[date] = { date, income: 0, expense: 0 };
      }
  
      if (type === 1) { // 假设 type 为 1 是收入
        acc[date].income = total;
      } else { // 其他为支出
        acc[date].expense = total;
      }
  
      return acc;
    }, {});
  
    return Object.values(groupedResult);
  }
  // async getStatistics({
  //   openid,
  //   startDate = new Date(),
  //   endDate = new Date()
  // }) {
  //   const { ctx } = this;

  //   return await ctx.model.Account.getStatistics({
  //     openid,
  //     startDate,
  //     endDate
  //   });
  // }
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