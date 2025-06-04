const Service = require('egg').Service;

class MenstrualSettingService extends Service {
    async upsert(params) {
        const { ctx } = this;
        
        const settingData = {
            user_openid: params.openid,
            cycle_length: params.cycle_length || 28,
            period_length: params.period_length || 5,
            remind_before_period: params.remind_before_period || 3,
            remind_before_ovulation: params.remind_before_ovulation || 14,
            is_reminder_active: params.is_reminder_active !== undefined ? params.is_reminder_active : true
        };

        // 使用upsert方法
        const [setting, created] = await ctx.model.MenstrualSetting.upsert(settingData, {
            returning: true
        });

        return {
            id: setting.id,
            ...settingData,
            isNewRecord: created
        };
    }
}

module.exports = MenstrualSettingService;