const Controller = require('egg').Controller;

class UserLimitController extends Controller {
    async addOrUpdate() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { daily_limit, monthly_limit, yearly_limit, open_daily } = ctx.request.body;
            // 获取当前用户ID
            const openid = ctx.state.user.openid;
            // 参数校验
            // if (!daily_limit || !monthly_limit || !yearly_limit) {
            //     ctx.throw(400, '缺少必要参数');
            // }

            // 调用Service层
            const result = await ctx.service.userLimit.addOrUpdate({
                user_openid: openid,
                daily_limit: parseFloat(daily_limit),
                monthly_limit: parseFloat(monthly_limit),
                yearly_limit: parseFloat(yearly_limit),
                open_daily
            });

            ctx.body = ctx.app.common.response.success(result);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '操作失败: ' + error.message);
        }
    }
    async get() {
        const { ctx } = this;
        try {
            // 获取当前用户ID
            const openid = ctx.state.user.openid;
            // 调用Service层查询数据
            const result = await ctx.service.userLimit.getByOpenid(openid);
            ctx.body = ctx.app.common.response.success(result);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '操作失败: ' + error.message);
        }
    }
}

module.exports = UserLimitController;