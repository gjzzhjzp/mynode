const user = require('../router/user');

const Service = require('egg').Service;

class AccountService extends Service {
  async createAccount(data) {
    const { ctx } = this;
    // 参数校验
    if (!data.amount || data.type === undefined || !data.category || !data.date) {
      ctx.throw(400, '缺少必要参数');
    }
    // 获取用户额度设置
    const userLimit = await ctx.model.UserLimit.findOne({
      where: { user_openid: data.user_openid }
    });
    if (userLimit) {
      // 检查每日额度
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const todaySpent = await ctx.model.Account.sum('amount', {
        where: {
          user_openid: data.user_openid,
          date: { [ctx.app.Sequelize.Op.between]: [todayStart, todayEnd] }
        }
      });

      if (todaySpent + data.amount > userLimit.daily_limit) {
        await this.sendOverLimitNotification(data.user_openid, 'daily', userLimit.daily_limit);
      }

      // 检查每月额度
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthSpent = await ctx.model.Account.sum('amount', {
        where: {
          user_openid: data.user_openid,
          date: { [ctx.app.Sequelize.Op.between]: [monthStart, monthEnd] }
        }
      });

      if (monthSpent + data.amount > userLimit.monthly_limit) {
        await this.sendOverLimitNotification(data.user_openid, 'monthly', userLimit.monthly_limit);
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
          user_openid: data.user_openid,
          date: { [ctx.app.Sequelize.Op.between]: [yearStart, yearEnd] }
        }
      });

      if (yearSpent + data.amount > userLimit.yearly_limit) {
        await this.sendOverLimitNotification(data.user_openid, 'yearly', userLimit.yearly_limit);
      }
    }
    return await ctx.model.Account.create(data);
  }
  async sendOverLimitNotification(openid, limitType, limitAmount) {
    const { ctx } = this;
    const { xcx } = this.config.thirdApi;
    console.log("sendOverLimitNotification----------------",openid,limitType,limitAmount);
    try {
      const data = {
        touser: openid,
        template_id: 'cZopylf8s_GkMnbN9Zk3mVCGw3ikIGP-tp0Y8YutwAs', // 替换为实际的小程序模板ID
        page: 'pages/index/index',
        data: {
          thing1: { value: `超额提醒：123` },
          amount2: { value: `限额：￥1000` },
          time3: { value: new Date().toLocaleDateString() },
          thing4:{value:"这是一条测试消息"}
        }
      };
  
      await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send`, {
        method: 'POST',
        dataType: 'json',
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      ctx.logger.info(`成功发送超额通知给用户: ${openid}`);
    } catch (error) {
      ctx.logger.error(`发送超额通知给用户 ${openid} 失败:`, error);
    }
  }
  async getAccountList({ page, rows, openid, order }) {
    const { ctx } = this;
    const limit = parseInt(rows, 10);  // 确保rows是数字
    const offset = (parseInt(page, 10) - 1) * limit;  // 确保page是数字并计算偏移量
    return await ctx.model.Account.findAll({
      where: { user_openid: openid },
      order: order || [['created_at', 'DESC']],  // 默认按创建时间降序排列
      limit: limit,
      offset: offset
    });
  }
  // 账单统计
  async getStatisticsByfl({
    openid,
    type = 'day',
    startDate = new Date(),
    endDate = new Date()
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
}

module.exports = AccountService;