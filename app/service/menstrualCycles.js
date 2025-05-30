const Service = require('egg').Service;

class MenstrualCyclesService extends Service {
    async create(params) {
        const { app, ctx } = this;
        
        // 参数基础验证
        if (!params.start_date || !params.end_date) {
            ctx.throw(400, '必须提供开始和结束日期');
        }
        
        try {
            // 计算经期天数
            const startDate = new Date(params.start_date);
            const endDate = new Date(params.end_date);
            
            if (startDate > endDate) {
                ctx.throw(400, '结束日期不能早于开始日期');
            }
            
            const periodLength = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
            
            // 获取最近一次记录来计算周期长度
            const latestRecord = await ctx.model.MenstrualCycle.getLatestRecord(params.user_openid);
            let cycleLength = 28; // 默认值
            
            if (latestRecord) {
                const lastStartDate = new Date(latestRecord.start_date);
                cycleLength = Math.ceil((startDate - lastStartDate) / (1000 * 60 * 60 * 24));
            }
            
            const record = {
                user_openid: params.user_openid,
                start_date: startDate,
                end_date: endDate,
                flow_level: params.flow_level || 5,
                pain_level: params.pain_level || null,
                mood: params.mood || null,
                notes: params.notes || '',
                period_length: periodLength,
                cycle_length: cycleLength,
                remind_before_period: params.remind_before_period || 3,
                remind_before_ovulation: params.remind_before_ovulation || 14,
                is_reminder_active: params.is_reminder_active !== undefined ? params.is_reminder_active : true
            };
            
            // 使用模型创建记录
            const result = await ctx.model.MenstrualCycle.create(record);
            
            // 返回创建结果
            return {
                id: result.id,
                ...record
            };
            
        } catch (error) {
            ctx.logger.error('创建月经记录失败:', error);
            throw error;
        }
    }
    async checkIsInPeriod({ openid, date }) {
        const { ctx } = this;
        
        try {
            const queryDate = new Date(date);
            
            // 查询包含该日期的经期记录
            const record = await ctx.model.MenstrualCycle.findOne({
                where: {
                    user_openid: openid,
                    start_date: { [ctx.app.Sequelize.Op.lte]: queryDate },
                    end_date: { [ctx.app.Sequelize.Op.gte]: queryDate }
                }
            });
            
            return {
                isInPeriod: !!record,
                currentRecord: record
            };
            
        } catch (error) {
            ctx.logger.error('查询经期状态失败:', error);
            throw error;
        }
    }
}

module.exports = MenstrualCyclesService;