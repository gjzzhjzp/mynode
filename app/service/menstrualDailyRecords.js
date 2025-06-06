const Service = require('egg').Service;

class MenstrualDailyRecordsService extends Service {
    async upsert(params) {
        const { ctx } = this;

        // 构造数据
        let recordData = {
            user_openid: params.openid,
            record_date: new Date(params.record_date)
        };
        if (params.is_period) {
            recordData.is_period = params.is_period;
        }
        if (params.flow_level) {
            recordData.flow_level = params.flow_level;
        }
        if (params.pain_level) {
            recordData.pain_level = params.pain_level;
        }
        if (params.mood) {
            recordData.mood = params.mood;
        }
        if (params.notes) {
            recordData.notes = params.notes;
        }
        // 检查并更新或创建记录
        const [record, created] = await ctx.model.MenstrualDailyRecords.upsert(recordData, {
            returning: true
        });
        // 如果标记为经期，处理周期记录
        // if (params.is_period) {
        //     const setting = await ctx.model.MenstrualSetting.findOne({
        //         where: { user_openid: params.openid }
        //     });
        //     if (setting) {
        //         const periodLength = setting.period_length || 5; // 默认5天
        //         const endDate = new Date(recordData.record_date);
        //         endDate.setDate(endDate.getDate() + periodLength - 1);
        //         console.log('upsert:', recordData.record_date, endDate,periodLength);
        //         await ctx.model.MenstrualPeriod.upsert({
        //             user_openid: params.openid,
        //             start_date: recordData.record_date,
        //             end_date: endDate,
        //             // period_length: periodLength
        //         });
        //     }
        // }
        return {
            id: record.id,
            ...recordData,
            isNewRecord: created
        };
    }
    async getByDate({ openid, date }) {
        const { ctx } = this;
        console.log("getByDate", openid, date)
        const queryDate = new Date(date);
        queryDate.setHours(0, 0, 0, 0); // 设置为当天开始时间
        return await ctx.model.MenstrualDailyRecords.findOne({
            where: {
                user_openid: openid,
                record_date: queryDate
            },
            raw: true
        });
    }
    async getMonthlyPeriodRecords({ openid, year, month }) {
        const { ctx } = this;

        // 计算月份的开始和结束日期
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);
        endDate.setHours(23, 59, 59, 999);

        // 1. 获取标记为经期的日期
        // const markedRecords = await ctx.model.MenstrualDailyRecords.findAll({
        //     where: {
        //         user_openid: openid,
        //         record_date: {
        //             [ctx.app.Sequelize.Op.between]: [startDate, endDate]
        //         }
        //     },
        //     attributes: ['record_date'],
        //     raw: true
        // });

        // 2. 获取用户的月经周期记录
        const periods = await ctx.model.MenstrualPeriod.findAll({
            where: {
                user_openid: openid,
                [ctx.app.Sequelize.Op.and]: [
                    { start_date: { [ctx.app.Sequelize.Op.lte]: endDate } },
                    { end_date: { [ctx.app.Sequelize.Op.gte]: startDate } }
                ]
            },
            raw: true
        });

        // 合并结果
        const periodDates = new Set();

        // // 添加标记为经期的日期
        // markedRecords.forEach(record => {
        //     const date = new Date(record.record_date);
        //     periodDates.add(date.toISOString().split('T')[0]);
        // });

        // 添加月经周期内的日期
        periods.forEach(period => {
            const start = new Date(period.start_date);
            const end = new Date(period.end_date);

            for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                if (d >= startDate && d <= endDate) {
                    d = new Date(d);
                    periodDates.add(d.toISOString().split('T')[0]);
                }
            }
        });

        // 转换为排序后的数组
        return Array.from(periodDates).sort();
    }
}

module.exports = MenstrualDailyRecordsService;