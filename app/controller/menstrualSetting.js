const Controller = require('egg').Controller;

class MenstrualSettingController extends Controller {
    async upsert() {
        const { ctx } = this;
        try {
            const params = {
                ...ctx.request.body,
                openid: ctx.state.user.openid
            };

            // 调用Service层
            const result = await ctx.service.menstrualSetting.upsert(params);

            ctx.body = ctx.app.common.response.success(result);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '操作设置失败: ' + error.message);
        }
    }
}

module.exports = MenstrualSettingController;