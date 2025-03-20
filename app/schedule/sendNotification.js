const { Subscription } = require('egg');

module.exports = class SendNotification extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10s', // 每10秒执行一次，用于测试
      // cron: '0 0 10 * * *', // 正式环境使用，每天早上10点执行
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
        await this.sendTemplateMessage(user.openid);
      }
    } catch (error) {
      ctx.logger.error('发送通知失败:', error);
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

      // 构建消息内容
      const data = {
        touser: openid,
        template_id: 'your_template_id', // 替换为实际的小程序模板ID
        page: 'pages/index/index',
        data: {
          thing1: { value: '每日消费提醒' },
          amount2: { value: statistics.reduce((sum, item) => sum + item.total_amount, 0).toFixed(2) },
          date3: { value: yesterday.toLocaleDateString() }
        }
      };

      // 发送模板消息
      await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send`, {
        method: 'POST',
        dataType: 'json',
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      ctx.logger.info(`成功发送通知给用户: ${openid}`);
    } catch (error) {
      ctx.logger.error(`发送通知给用户 ${openid} 失败:`, error);
    }
  }
};