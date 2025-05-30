const { Subscription } = require('egg');

module.exports = class AccountReminder extends Subscription {
    static get schedule() {
        return {
            cron: '0 0 22 * * *', // 每天晚上10点执行
            type: 'worker',
        };
    }

    async subscribe() {
        const { ctx } = this;
        try {
            // 获取需要发送提醒的用户列表
            const users = await ctx.model.UserLimit.findAll({
                where: {
                    open_accountReminder: true // 只查询开启提醒的用户
                },
                raw: true
            });

            // 遍历用户发送提醒
            for (const user of users) {
                await this.sendReminder(user.user_openid, user.currency || "￥");
            }
        } catch (error) {
            ctx.logger.error('记账提醒任务执行失败:', error);
        }
    }

    async sendReminder(openid, currency = "￥") {
        const { ctx } = this;
        const { xcx } = this.config.thirdApi;
        // 在sendReminder方法中添加
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const startDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const endDate = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() + 1);

        const statistics = await ctx.model.Account.getStatistics({
            openid,
            startDate,
            endDate
        });

        let yesterdayExpense = 0;
        let yesterdayIncome = 0;
        statistics.forEach(item => {
            if (item.type == 1) { // 假设type为1是收入
                yesterdayIncome = item.total_amount;
            } else { // 其他为支出
                yesterdayExpense = item.total_amount;
            }
        });
        try {
            const accessToken = await ctx.service.wechat.getAccessToken();

            const data = {
                touser: openid,
                template_id: xcx.tmplIds.accountReminder, // 需要配置模板ID
                page: 'pages/account/index',
                miniprogram_state: xcx.miniprogram_state,
                data: {
                    amount6: {
                        value: yesterdayExpense.toFixed(2)///昨日支出
                    },
                    amount10: {
                        amount10: yesterdayIncome.toFixed(2)///昨日收入
                    },
                    thing4: {
                        value: '别忘了记录今天的收支情况哦！'
                    },
                    time1: {
                        value: new Date().toLocaleTimeString('zh-CN', { hour12: false })
                    }
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

            ctx.logger.info(`成功发送记账提醒给用户: ${openid}`);
        } catch (error) {
            ctx.logger.error(`发送记账提醒给用户 ${openid} 失败:`, error);
        }
    }
};