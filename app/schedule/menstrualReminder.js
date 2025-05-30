const { Subscription } = require('egg');

module.exports = class MenstrualReminder extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 12 * * *', // 每天中午12点执行
            type: 'worker',
        };
    }

    async subscribe() {
        const { ctx } = this;
        try {
            // 获取当前日期
            const today = new Date();

            // 查询需要提醒的用户
            const usersToRemind = await ctx.model.MenstrualCycle.findAll({
                where: {
                    is_reminder_active: 1, // 开启提醒的用户
                },
                attributes: ['user_openid', 'remind_before_period'],
                group: ['user_openid'], // 每个用户只取一条记录
                raw: true
            });

            // 遍历用户发送提醒
            for (const user of usersToRemind) {
                // 获取用户最近的经期记录
                const latestRecord = await ctx.model.MenstrualCycle.findOne({
                    where: { user_openid: user.user_openid },
                    order: [['start_date', 'DESC']],
                    raw: true
                });

                if (latestRecord) {
                    // 计算下次经期开始日期
                    const nextPeriodDate = new Date(latestRecord.start_date);
                    nextPeriodDate.setDate(nextPeriodDate.getDate() + latestRecord.cycle_length);

                    // 计算提醒日期
                    const reminderDate = new Date(nextPeriodDate);
                    reminderDate.setDate(reminderDate.getDate() - latestRecord.remind_before_period);

                    // 检查今天是否是提醒日
                    if (today.toDateString() === reminderDate.toDateString()) {
                        await this.sendReminder(user.user_openid, nextPeriodDate);
                    }
                }
            }
        } catch (error) {
            ctx.logger.error('经期提醒任务执行失败:', error);
        }
    }

    async sendReminder(openid, nextPeriodDate) {
        const { ctx } = this;
        const { xcx } = this.config.thirdApi;

        try {
            const accessToken = await ctx.service.wechat.getAccessToken();
            const formattedDate = nextPeriodDate.toLocaleDateString('zh-CN');
            const data = {
                touser: openid,
                template_id: xcx.tmplIds.menstrualReminder, // 需要配置模板ID
                page: 'pages/menstrual/index',
                miniprogram_state: xcx.miniprogram_state,
                data: {
                    date1: { value: formattedDate },//预计日期
                    number2: { value: latestRecord.remind_before_period.toString() }, // 倒计时天数
                    thing3: { value: '您的经期即将开始，请做好准备' },
                    time4: { value: latestRecord.start_date.toLocaleDateString('zh-CN') }//上月日期
                }
            };
            await ctx.curl(`${xcx.url}/cgi-bin/message/subscribe/send?access_token=${accessToken}`, {
                method: 'POST',
                dataType: 'json',
                data,
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            ctx.logger.info(`成功发送经期提醒给用户: ${openid}`);
        } catch (error) {
            ctx.logger.error(`发送经期提醒给用户 ${openid} 失败:`, error);
        }
    }
};