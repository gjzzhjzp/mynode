const Controller = require('egg').Controller;

class MenstrualDailyRecordsController extends Controller {
    async add() {
        const { ctx } = this;
        try {
            const params = {
                ...ctx.request.body,
                openid: ctx.state.user.openid
            };
            // 调用Service层
            const result = await ctx.service.menstrualDailyRecords.upsert(params);
            
            ctx.body = ctx.app.common.response.success(result);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加/更新每日记录失败: ' + error.message);
        }
    }
    async getByDate() {
        const { ctx } = this;
        try {
            const { date } = ctx.query;
            const openid = ctx.state.user.openid;
            
            if (!date) {
                ctx.throw(400, '必须提供查询日期');
            }

            // 调用Service层
            const record = await ctx.service.menstrualDailyRecords.getByDate({
                openid,
                date
            });

            ctx.body = ctx.app.common.response.success(record);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '查询每日记录失败: ' + error.message);
        }
    }
    async getMonthlyRecords() {
        const { ctx } = this;
        try {
            const { year, month } = ctx.query;
            const openid = ctx.state.user.openid;
            
            const periodDates = await ctx.service.menstrualDailyRecords.getMonthlyPeriodRecords({
                openid,
                year: parseInt(year),
                month: parseInt(month)
            });
            
            ctx.body = ctx.app.common.response.success(periodDates);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取月度记录失败: ' + error.message);
        }
    }
}

module.exports = MenstrualDailyRecordsController;