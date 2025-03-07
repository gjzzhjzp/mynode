// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');

class accountController extends Controller {
    async addAccount() {
        const { ctx } = this;
        try {
            // 获取请求参数并校验
            const { amount, type, category, description } = ctx.request.body;
            if (!amount || !type || !category ) {
                ctx.body = ctx.app.common.response.error(400, '缺少必要参数');
                return;
            }

            // 获取当前用户ID
            const userId = ctx.state.user.username;
            
            // 构造账单数据
            const accountData = {
                user_id: userId,
                amount: parseFloat(amount),
                type: type,      // 1-收入 0-支出
                category: category,       // 分类名称
                date: new Date(),     // 账单日期
                description: description || '',
                created_at: new Date()
            };

            // 插入数据库
            const result = await ctx.app.mysql.insert('accounts', accountData);
            
            ctx.body = ctx.app.common.response.success({
                id: result.insertId,
                ...accountData
            });
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加账单失败: ' + error.message);
        }
    }
    async getCategory() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { type } = ctx.query;
            
            // 校验参数
            if (typeof type === 'undefined' || !['expense', 'income'].includes(type)) {
                return ctx.body = ctx.app.common.response.error(400, '缺少类型参数或参数不合法');
            }
            console.log("getCategory",type);
            // 查询数据库
            const categories = await ctx.app.mysql.select('categories', {
                where: { type: parseInt(type) },
                columns: ['id', 'name','type','category']
            });

            ctx.body = ctx.app.common.response.success(categories);
            
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取分类失败: ' + error.message);
        }
    }
}
module.exports = accountController;
