const Service = require('egg').Service;

class MenstrualDailyRecordsService extends Service {
    async upsert(params) {
        const { ctx } = this;
        
        // 构造数据
        const recordData = {
            user_openid: params.openid,
            record_date: new Date(params.record_date),
            is_period: params.is_period || false,
            flow_level: params.flow_level || null,
            pain_level: params.pain_level || null,
            mood: params.mood || null,
            notes: params.notes || ''
        };

        // 检查并更新或创建记录
        const [record, created] = await ctx.model.MenstrualDailyRecords.upsert(recordData, {
            returning: true
        });

        return {
            id: record.id,
            ...recordData,
            isNewRecord: created
        };
    }
    async getByDate({ openid, date }) {
        const { ctx } = this;
        console.log("getByDate",openid,date)
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
}

module.exports = MenstrualDailyRecordsService;