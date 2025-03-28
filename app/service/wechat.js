const user = require('../router/user');

const Service = require('egg').Service;

class WechatService extends Service {
    async getAccessToken() {
        const { ctx, config } = this;
        const { xcx } = config.thirdApi;

        const result = await ctx.curl(`${xcx.url}/cgi-bin/token`, {
            method: 'GET',
            dataType: 'json',
            data: {
                grant_type: 'client_credential',
                appid: xcx.appid,
                secret: xcx.secret,
            },
        });

        if (result.data.errcode) {
            ctx.throw(500, '获取 access_token 失败');
        }

        return result.data.access_token;
    }
    async sendOverLimitNotification(openid, limitType, limitAmount,allAmount) {
        const { ctx } = this;
        const { xcx } = this.config.thirdApi;
      
        const thing4=`您的预算为 ￥${limitAmount}，现已支出 ￥${allAmount}`;
        console.log("sendOverLimitNotification----------------",openid,limitType,limitAmount,allAmount,allAmount-limitAmount,thing4);
        try {
          const accessToken = await this.getAccessToken();  // 获取 access_token
          const data = {
            touser: openid,
            template_id: xcx.tmplIds.overspend, // 替换为实际的小程序模板ID
            page: 'pages/index/index',
            miniprogram_state:xcx.miniprogram_state,
            data: {
              thing1: { value: `超额提醒：${limitType === 'daily' ? '每日预算超支' : limitType === 'monthly' ? '每月预算超支' : '每年预算超支'}` },
              amount2: { value: `￥${allAmount-limitAmount}` },
              time3: { value: new Date().toLocaleString() },
              thing4: { value: "请及时调整您的消费计划" }
            }
          };
      
          const result = await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send?access_token=${accessToken}`, {
            method: 'POST',
            dataType: 'json',
            data,
            headers: {
              'Content-Type': 'application/json'
            }
          });
          console.log("成功发送超额通知给用户result----------------",result);
        } catch (error) {
          ctx.logger.error(`发送超额通知给用户 ${openid} 失败:`, error);
        }
      }
}
module.exports = WechatService;