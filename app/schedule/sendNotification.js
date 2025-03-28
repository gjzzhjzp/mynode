const { Subscription } = require('egg');

module.exports = class SendNotification extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '1h', // 每10秒执行一次，用于测试
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
      console.log("statistics----------------",statistics,startDate,endDate);
      const accessToken = await ctx.service.wechat.getAccessToken();  // 获取 access_token

      // 构建消息内容
      const data = {
        touser: openid,
        template_id: xcx.tmplIds.daily, // 替换为实际的小程序模板ID
        page: 'pages/index/index',
        miniprogram_state:xcx.miniprogram_state,
        data: {
          thing1: { value: '￥100.00' },///昨日支出
          thing2: { value: '￥200.00' },///昨日收入
          thing6: { value:'$300.00' }//本月统计
        }
      };

      // 发送模板消息
     const result= await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send?access_token=${accessToken}`, {
        method: 'POST',
        dataType: 'json',
        data,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log("成功发送日报通知给用户result----------------",result);
      ctx.logger.info(`成功发送通知给用户: ${openid}`);
    } catch (error) {
      ctx.logger.error(`发送通知给用户 ${openid} 失败:`, error);
    }
  }
};