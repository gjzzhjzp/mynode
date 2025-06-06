const Controller = require('egg').Controller;

class MenstrualSettingController extends Controller {
    async add() {
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
    
    async get() {
        const { ctx } = this;
        try {
            const openid = ctx.state.user.openid;
            
            // 调用Service层查询设置
            const setting = await ctx.service.menstrualSetting.getByOpenid(openid);
            
            if (!setting) {
                ctx.body = ctx.app.common.response.error(404, '未找到用户设置');
                return;
            }

            ctx.body = ctx.app.common.response.success(setting);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '查询设置失败: ' + error.message);
        }
    }
}

module.exports = MenstrualSettingController;