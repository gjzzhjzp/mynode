const { Controller } = require('egg');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.wechat.sendOverLimitNotification("o5DNf7Kcd5UqkNq_5pj7lb1Hc7Mw");
    ctx.body = 'hi, egg'+JSON.stringify(result);
  }
  async xcxm(){
    const { ctx } = this;
    const { xcx } = this.config.thirdApi;
  
    try {
      // 获取 access_token
      const accessToken = await ctx.service.wechat.getAccessToken();
  
      // 调用微信生成小程序码接口
      const result = await ctx.curl(`${xcx.url}/wxa/getwxacode?access_token=${accessToken}`, {
        method: 'POST',
        contentType: 'json', // 明确指定请求头为 JSON
        dataType: 'buffer', // 返回二进制数据
        data: {
          path: 'pages/index/index', // 小程序页面路径
          width: 430, // 二维码宽度
          is_hyaline: false // 是否透明背景
        }
      });
      ctx.set('Content-Type', 'image/png');
      // 返回小程序码图片数据
      ctx.body = result.data;
    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, '生成小程序码失败: ' + error.message);
    }
  }
}

module.exports = HomeController;
