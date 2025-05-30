const Controller = require('egg').Controller;

class UserLimitController extends Controller {
    async addOrUpdate() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { daily_limit, monthly_limit, yearly_limit, open_daily,open_accountReminder, currency } = ctx.request.body;
            // 获取当前用户ID
            const openid = ctx.state.user.openid;
            // 参数校验
            // if (!daily_limit || !monthly_limit || !yearly_limit) {
            //     ctx.throw(400, '缺少必要参数');
            // }
            let parames = { user_openid: openid };
            if (typeof daily_limit != "undefined") parames.daily_limit = parseFloat(daily_limit || 0);
            if (typeof monthly_limit != "undefined") parames.monthly_limit = parseFloat(monthly_limit || 0);
            if (typeof yearly_limit != "undefined") parames.yearly_limit = parseFloat(yearly_limit || 0);
            if (typeof open_daily != "undefined") parames.open_daily = open_daily;
            if (typeof open_accountReminder != "undefined") parames.open_accountReminder = open_accountReminder;
            if (typeof currency != "undefined") parames.currency = currency || "￥";

            // 调用Service层
            const result = await ctx.service.userLimit.addOrUpdate(parames);

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