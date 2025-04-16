const { Subscription } = require('egg');

module.exports = class SendNotification extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      // interval: '10s', // 每10秒执行一次，用于测试
      cron: '0 0 10 * * *', // 正式环境使用，每天早上10点执行
      type: 'worker', // 指定所有的 worker 都需要执行
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    const { ctx } = this;
    try {
      // 获取需要发送通知的用户列表
      const users = await ctx.model.Account.getUsersForNotification();

      // 遍历用户，发送通知
      for (const user of users) {
        // 查询用户限额设置
        const userLimit = await ctx.model.UserLimit.findOne({
          where: { user_openid: user.openid }
        });
        // 如果用户开启日报功能，发送通知
        if (userLimit && userLimit.open_daily) {
          await this.sendTemplateMessage(user.openid);
        }
      }
    } catch (error) {
      ctx.logger.info.error('发送通知失败:', error);
    }
  }

  async sendTemplateMessage(openid) {
    const { ctx } = this;
    const { xcx } = this.config.thirdApi;
    try {
      // 获取用户最近一天的消费记录
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
      const endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);

      const statistics = await ctx.model.Account.getStatistics({
        openid,
        startDate,
        endDate
      });

      // 获取本月支出和收入
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      monthEnd.setHours(23, 59, 59, 999);

      const monthStatistics = await ctx.model.Account.getStatistics({
        openid,
        startDate: monthStart,
        endDate: monthEnd
      });
      let monthIncome = 0;
      let monthExpense = 0;
      monthStatistics.forEach(item => {
        if (item.type === 1) { // 假设 type 为 1 是收入
          monthIncome = item.total_amount;
        } else { // 其他为支出
          monthExpense = item.total_amount;
        }
      });
      let incomeAccount = 0;
      let expecseAccount = 0;
      statistics.forEach(item => {
        if (item.type == 1) {
          incomeAccount = item.total_amount;
        } else {
          expecseAccount = item.total_amount;
        }
      })
      ctx.logger.info("statistics----------------", incomeAccount, expecseAccount,monthIncome,monthExpense, startDate, endDate);
      // return;
      const accessToken = await ctx.service.wechat.getAccessToken();  // 获取 access_token

      // 构建消息内容
      const data = {
        touser: openid,
        template_id: xcx.tmplIds.daily, // 替换为实际的小程序模板ID
        page: 'pages/index/index',
        miniprogram_state: xcx.miniprogram_state,
        data: {
          thing1: { value: '￥' + Number(expecseAccount).toFixed(2) },///昨日支出
          thing2: { value: '￥' + Number(incomeAccount).toFixed(2) },///昨日收入
          thing6: { value: '支出￥'+Number(monthExpense).toFixed(2)+'，收入￥'+Number(monthIncome).toFixed(2) }//本月统计
        }
      };

      // 发送模板消息
      const result = await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send?access_token=${accessToken}`, {
        method: 'POST',
        dataType: 'json',
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      ctx.logger.info("成功发送日报通知给用户result----------------", result);
      ctx.logger.info.info(`成功发送通知给用户: ${openid}`);
    } catch (error) {
      ctx.logger.info.error(`发送通知给用户 ${openid} 失败:`, error);
    }
  }
};