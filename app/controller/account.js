// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');

class accountController extends Controller {
    async addAccount() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { amount, type, category, description, date } = ctx.request.body;

            // 获取当前用户ID
            const openid = ctx.state.user.openid;

            // 构造账单数据
            const accountData = {
                user_openid: openid,
                amount: parseFloat(amount),
                type: type,
                category: category,
                date: new Date(date), // 使用北京时间,
                description: description || ''
            };
            console.log(accountData);
            // 调用Service层
            const result = await ctx.service.account.createAccount(accountData);

            ctx.body = ctx.app.common.response.success({
                id: result.id,
                ...accountData
            });

        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加账单失败: ' + error.message);
        }
    }
    async getAccountList() {
        const { ctx } = this;
        try {
            console.log("openid-------------123",ctx.state.user);
            const { page, rows } = ctx.query;
            const openid = ctx.state.user.openid;
            console.log("openid-------------",openid);
            const accounts = await ctx.service.account.getAccountList({ page, rows, openid, order: [['created_at', 'DESC']] });
            ctx.body = ctx.app.common.response.success(accounts);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取账单失败: ' + error.message);
        }
    }
    async getStatisticsByfl() {
        const { ctx } = this;
        try {
            const { type, startDate, endDate } = ctx.query;
            const openid = ctx.state.user.openid;
            const statistics = await ctx.service.account.getStatisticsByfl({
                openid,
                type: type || 'day',
                startDate: startDate || new Date(),
                endDate: endDate || new Date()
            });
            ctx.body = ctx.app.common.response.success(statistics);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取统计失败: ' + error.message);
        }
    }
    async getStatistics() {
        const { ctx } = this;
        try {
            const { startDate, endDate } = ctx.query;
            const openid = ctx.state.user.openid;
            const statistics = await ctx.service.account.getStatistics({
                openid,
                startDate: startDate || new Date(),
                endDate: endDate || new Date()
            });
            ctx.body = ctx.app.common.response.success(statistics);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取统计失败: ' + error.message);
        }
    }
    async getCategory() {
        const { ctx } = this;
        try {
            const { type } = ctx.query;
            const categories = await ctx.service.category.getCategoriesByType(type);
            ctx.body = ctx.app.common.response.success(categories);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取分类失败: ' + error.message);
        }
    }
}
module.exports = accountController;
