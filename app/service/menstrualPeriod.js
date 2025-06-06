const Service = require('egg').Service;

class MenstrualPeriodService extends Service {
    async create(params) {
        const { ctx } = this;
        
        // 自动计算周期长度
        const startDate = new Date(params.start_date);
        const endDate = new Date(params.end_date);
        const cycleLength = Math.round((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const period = await ctx.model.MenstrualPeriod.create({
            user_openid: params.user_openid,
            start_date: startDate|| null,
            end_date: endDate|| null,
            period_length: cycleLength,
            cycle_length: params.cycle_length || null,
            avg_flow_level: params.avg_flow_level || null,
            avg_pain_level: params.avg_pain_level || null,
            notes: params.notes || null
        });

        return period;
    }
    async getByMonth({ openid, year, month }) {
        const { ctx } = this;
        
        // 计算月份的开始和结束日期
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);
    
        return await ctx.model.MenstrualPeriod.findAll({
            where: {
                user_openid: openid,
                [ctx.app.Sequelize.Op.or]: [
                    {
                        start_date: { [ctx.app.Sequelize.Op.lte]: endDate },
                        end_date: { [ctx.app.Sequelize.Op.gte]: startDate }
                    }
                ]
            },
            order: [['start_date', 'DESC']],
            raw: true
        });
    }
}

module.exports = MenstrualPeriodService;