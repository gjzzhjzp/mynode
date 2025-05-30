const { Controller } = require('egg');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const result = await ctx.service.wechat.sendOverLimitNotification("o5DNf7Kcd5UqkNq_5pj7lb1Hc7Mw");
    ctx.body = 'hi, egg' + JSON.stringify(result);
  }
  async xcxm() {
    const { ctx } = this;
    const { xcx } = this.config.thirdApi;
    const { path = 'pages/index/index' } = ctx.query;
    try {
      // 获取 access_token
      const accessToken = await ctx.service.wechat.getAccessToken();

      // 调用微信生成小程序码接口
      const result = await ctx.curl(`${xcx.url}/wxa/getwxacode?access_token=${accessToken}`, {
        method: 'POST',
        contentType: 'json', // 明确指定请求头为 JSON
        dataType: 'buffer', // 返回二进制数据
        data: {
          path: path, // 小程序页面路径
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
  async uploadImage() {
    const { ctx } = this;
    try {
      // 获取上传的文件流
      const file = ctx.request.files[0];

      // 校验文件类型
      const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];
      if (!allowedTypes.includes(file.mime)) {
        ctx.throw(400, '只允许上传PNG/JPEG/GIF格式的图片');
      }

      // 生成唯一文件名
      const ext = path.extname(file.filename);
      const fileName = `${Date.now()}${ext}`;


      // 保存路径
      const savePath = path.join(this.config.baseDir, 'app/public/uploads', fileName);

      // 确保上传目录存在
      await fse.ensureDir(path.dirname(savePath));

      // 使用 fs-extra 的跨设备移动方法
      await fse.move(file.filepath, savePath);

      // 返回访问URL
      ctx.body = ctx.app.common.response.success({
        url: `/static/uploads/${fileName}`
      });

    } catch (error) {
      ctx.body = ctx.app.common.response.error(500, `上传失败: ${error.message}`);
    }
  }
}

module.exports = HomeController;
