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
    async sendOverLimitNotification(openid, limitType, limitAmount) {
        const { ctx } = this;
        const { xcx } = this.config.thirdApi;
        console.log("sendOverLimitNotification----------------",openid,limitType,limitAmount);
        try {
          const accessToken = await this.getAccessToken();  // 获取 access_token
          const data = {
            touser: openid,
            template_id: 'cZopylf8s_GkMnbN9Zk3mVCGw3ikIGP-tp0Y8YutwAs', // 替换为实际的小程序模板ID
            page: 'pages/index/index',
            miniprogram_state:"trial",//developer为开发版；trial为体验版；formal为正式版；
            data: {
              thing1: { value: `超额提醒：123` },
              amount2: { value: `限额：￥1000` },
              time3: { value:  new Date().toLocaleString() },
              thing4:{value:"这是一条测试消息"}
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
          ctx.logger.info(`成功发送超额通知给用户: ${openid}`);
        } catch (error) {
          ctx.logger.error(`发送超额通知给用户 ${openid} 失败:`, error);
        }
      }
}
module.exports = WechatService;