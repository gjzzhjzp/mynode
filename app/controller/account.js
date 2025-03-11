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
                date: new Date(date),
                description: description || ''
            };
            
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
    async getCategory() {
        const { ctx } = this;
        try {
            const { type } = ctx.query;
            if (typeof type === 'undefined' || !['0', '1'].includes(type)) {
                return ctx.body = ctx.app.common.response.error(400, '缺少类型参数或参数不合法');
            }
            const categories = await ctx.service.category.getCategoriesByType(parseInt(type));
            ctx.body = ctx.app.common.response.success(categories);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取分类失败: ' + error.message);
        }
    }
}
module.exports = accountController;
