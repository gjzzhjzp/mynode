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
            // 处理日期
            const inputDate = new Date(date);
            const now = new Date();
            const isSameDay = inputDate.toDateString() === now.toDateString();

            // 设置 created_at
            const createdAt = isSameDay ? now : new Date(inputDate.setHours(23, 59, 59, 999));
            // 构造账单数据
            // 构造账单数据
            const accountData = {
                user_openid: openid,
                amount: parseFloat(amount),
                type: type,
                category: category,
                date: inputDate, // 使用处理后的日期
                description: description || '',
                created_at: createdAt
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
            console.log("openid-------------123", ctx.state.user);
            const { page, rows } = ctx.query;
            const openid = ctx.state.user.openid;
            console.log("openid-------------", openid);
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
                startDate: startDate,
                endDate: endDate
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
    async update() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const payload = ctx.request.body;
            // 基础格式校验
            // ctx.validate({
            //     amount: { type: 'number', required: false },
            //     type: { type: 'string', required: false },
            //     category: { type: 'string', required: false },
            //     date: { type: 'date', required: false },
            //     description: { type: 'string', required: false }
            // }, payload);
            // 处理日期
            if (payload.date) {
                const inputDate = new Date(payload.date);
                const now = new Date();
                const isSameDay = inputDate.toDateString() === now.toDateString();

                // 如果不是同一天，设置创建时间为当天的23:59
                if (!isSameDay) {
                    inputDate.setHours(23, 59, 59, 999);
                    payload.created_at = inputDate; // 更新创建时间
                }
            }
            const result = await ctx.service.account.update(id, payload);
            if (result[0] === 0) {
                ctx.body = ctx.app.common.response.error(404, '账单不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '编辑失败: ' + error.message);
        }
    }
    async delete() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const result = await ctx.service.account.delete(id);
            if (result === 0) {
                ctx.body = ctx.app.common.response.error(404, '账单不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '删除失败: ' + error.message);
        }
    }
}
module.exports = accountController;
