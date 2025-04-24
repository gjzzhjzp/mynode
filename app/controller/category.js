const { Controller } = require('egg');

class CategoryController extends Controller {
    async add() {
        const { ctx } = this;
        try {
            const { name, type, value, icon } = ctx.request.body;

            // 参数校验
            if (!name || !type || value === undefined) {
                ctx.throw(400, '缺少必要参数');
            }

            // 创建分类
            const category = await ctx.model.Category.create({
                name,
                type,
                value,
                icon: icon || '',
                status: 1 // 默认启用
            });

            ctx.body = ctx.app.common.response.success(category);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加分类失败: ' + error.message);
        }
    }
}

module.exports = CategoryController;
