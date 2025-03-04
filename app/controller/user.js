// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');

class UserController extends Controller {
  async create() {
    const { ctx } = this;
    const { username } = ctx.request.body;
   
    ctx.body = ctx.app.common.response.success({
      username
    })
  }
  async get() {
    const { ctx } = this;
    console.log("get", ctx.query);
    ctx.body = ctx.app.common.response.success({
      username: "测试",
      age: 18,
    })
  }
  async add() {
    const { ctx } = this;
    try {
      const result = await ctx.app.mysql.insert('users', { // 插入到 users 表
        username: "测试1",
        password: "1812345",
      });
      ctx.body = {
        code: 200,
        data: result,
        message: '插入成功',
      };
    } catch (error) {
      ctx.body = {
        code: 500,
        message: '插入失败: ' + error.message,
      };
    }
  }
    // 用户初始化进入的时候登录，获取基本信息
    async login() {
      // 获取上下文和配置信息
      const { ctx } = this;
      const {xcx} =this.config.thirdApi;
      // 从请求体中获取前端传来的code
      const { code } = ctx.request.body;
      // 构造请求微信小程序登录的URL
      const url = `${xcx.url}?appid=${xcx.appid}&secret=${xcx.secret}&js_code=${code}&grant_type=authorization_code`;
      try {
        // 发起HTTP请求，获取微信服务器返回的数据
        const data = await ctx.service.http.get(url);
  
        // 查询openid是否存在
        const user = await ctx.app.mysql.get('users', { openid: data.openid });
        let res;
        // 如果用户存在则更新用户名，不存在则插入新用户
        if (user) {
          // 存在则更新用户名为openid加上一个随机数
          res = await ctx.app.mysql.update('users', {
            username: data.openid + Math.random()
          }, {
            where: { openid: data.openid }
          });
        } else {
          // 不存在则插入新用户
          res = await ctx.app.mysql.insert('users', {
            username: data.openid + Math.random(),
            openid: data.openid,
          });
        }
        // 打印操作结果和用户信息
        console.log("res",res,user,user.id);
        // 生成JWT token
        const token = this.app.jwt.sign(
          {
            id: user.id||res.insertId,
            username: data.openid,
            openid: data.openid
          },
          this.config.jwt.secret,
          { expiresIn: '2h' }
        );
        // 返回成功响应，包含token和用户信息
        ctx.body=ctx.app.common.response.success({
          token:token,
          userinfo:{
            id:user.id||res.insertId,
            username:data.openid,
            openid: data.openid,
          }
        });
      } catch (error) {
        // 如果发生错误，返回错误响应
        ctx.body=ctx.app.common.response.error(500,error.message);
      }
    }
}
module.exports = UserController;
