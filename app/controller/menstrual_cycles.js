const Controller = require('egg').Controller;

class MenstrualCyclesController extends Controller {
    async add() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { start_date, end_date, flow_level, pain_level, mood, notes } = ctx.request.body;
            
            // 获取当前用户openid
            const openid = ctx.state.user.openid;
            
            // 处理日期
            const inputStartDate = new Date(start_date);
            const inputEndDate = new Date(end_date);
            const now = new Date();
            const isSameDay = inputStartDate.toDateString() === now.toDateString();
            
            // 设置 created_at
            const createdAt = isSameDay ? now : new Date(inputStartDate.setHours(23, 59, 59, 999));
            
            // 构造数据
            const cycleData = {
                user_openid: openid,
                start_date: inputStartDate,
                end_date: inputEndDate,
                flow_level: flow_level || 5,
                pain_level: pain_level || null,
                mood: mood || null,
                notes: notes || '',
                created_at: createdAt
            };
            
            ctx.logger.info('menstrual cycle data:', cycleData);
            
            // 调用Service层
            const result = await ctx.service.menstrualCycles.create(cycleData);
            
            ctx.body = ctx.app.common.response.success({
                id: result.id,
                ...cycleData
            });
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加月经记录失败: ' + error.message);
        }
    }
    // 我只提供某一天的日期，自行去查询是否在经期内
    async get() {
        const { ctx } = this;
        try {
            const { date } = ctx.query;
            const openid = ctx.state.user.openid;
            
            // 参数验证
            if (!date) {
                ctx.throw(400, '必须提供查询日期');
            }
    
            // 调用Service层检查是否在经期内
            const result = await ctx.service.menstrualCycles.checkIsInPeriod({
                openid,
                date
            });
    
            ctx.body = ctx.app.common.response.success(result);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '查询经期状态失败: ' + error.message);
        }
    }
    
    // ... existing get method ...
}

module.exports = MenstrualCyclesController;