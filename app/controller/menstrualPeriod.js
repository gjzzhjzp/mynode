const Controller = require('egg').Controller;

class MenstrualPeriodController extends Controller {
    async add() {
        const { ctx } = this;
        try {
            const { start_date, end_date, notes } = ctx.request.body;
            const openid = ctx.state.user.openid;
            
            // 计算周期长度和经期天数
            const startDate = new Date(start_date);
            const endDate = new Date(end_date);
            
            // 调用Service层
            const result = await ctx.service.menstrualPeriod.create({
                user_openid: openid,
                start_date: startDate,
                end_date: endDate,
                notes: notes || null
            });
            ctx.body = ctx.app.common.response.success(result);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加月经周期记录失败: ' + error.message);
        }
    }
    async getMonthlyRecords() {
        const { ctx } = this;
        try {
            const { year, month } = ctx.query;
            const openid = ctx.state.user.openid;
            
            if (!year || !month) {
                ctx.throw(400, '必须提供年份和月份');
            }

            const records = await ctx.service.menstrualPeriod.getByMonth({
                openid,
                year: parseInt(year),
                month: parseInt(month)
            });

            ctx.body = ctx.app.common.response.success(records);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取月经周期记录失败: ' + error.message);
        }
    }
}

module.exports = MenstrualPeriodController;