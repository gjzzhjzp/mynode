const { Controller } = require('egg');

class CategoryController extends Controller {
    async getCategory() {
        const { ctx } = this;
        try {
            const { type } = ctx.query;
            const openid = ctx.state.user.openid;
            const categories = await ctx.service.category.getCategoriesByType(type, openid);

            ctx.body = ctx.app.common.response.success(categories);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取分类失败: ' + error.message);
        }
    }
    async add() {
        const { ctx } = this;
        try {
            const { name, type = 0, value, icon } = ctx.request.body;
            const openid = ctx.state.user.openid; // 获取当前用户 openid
            // 参数校验
            if (!name || value === undefined) {
                ctx.throw(400, '缺少必要参数');
            }

            // 创建分类
            const category = await ctx.model.Category.create({
                name,
                type,
                value,
                icon: icon || 'icon-fenlei',
                status: 1, // 默认启用
                user_openid: openid // 关联当前用户
            });

            ctx.body = ctx.app.common.response.success(category);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加分类失败: ' + error.message);
        }
    }
    async update() {
        const { ctx } = this;
        try {
            const { id, name, type, value, icon } = ctx.request.body;
            const openid = ctx.state.user.openid;

            // 参数校验
            if (!id || !name) {
                ctx.throw(400, '缺少必要参数');
            }

            const result = await ctx.service.category.update(id, openid, { name, type, value, icon });
            if (result[0] === 0) {
                ctx.body = ctx.app.common.response.error(404, '分类不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '更新分类失败: ' + error.message);
        }
    }

    async delete() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const openid = ctx.state.user.openid;

            // 参数校验
            if (!id) {
                ctx.throw(400, '缺少必要参数');
            }

            const result = await ctx.service.category.delete(id, openid);
            if (result === 0) {
                ctx.body = ctx.app.common.response.error(404, '分类不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '删除分类失败: ' + error.message);
        }
    }
}

module.exports = CategoryController;
