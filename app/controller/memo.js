const Controller = require('egg').Controller;

class MemoController extends Controller {
    async create() {
        const { ctx } = this;
        try {
            const payload = ctx.request.body;
            // 基础格式校验
            ctx.validate({
                title: 'string',
                content: { type: 'string', required: false }
            });
            
            const result = await ctx.service.memo.create(payload);
            console.log("result", result);
            ctx.body = ctx.app.common.response.success(result);
        } catch (e) {
            ctx.error(422, '数据验证失败', { errors: e.errors || [e.message] });
        }
    }
    async getList() {
        const { ctx } = this;
        try {
            const { page = 1, rows = 10 } = ctx.query;
            const openid = ctx.state.user.openid;
            const result = await ctx.service.memo.getList({ openid, page, rows });
            ctx.body = ctx.app.common.response.success(result.list, { total: result.total });
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '查询失败: ' + error.message);
        }
    }
    async delete() {
        const { ctx } = this;
        try {
            const { id } =ctx.request.body;
            const result = await ctx.service.memo.delete(id);
            if (result === 0) {
                ctx.body = ctx.app.common.response.error(404, '备忘录不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '删除失败: ' + error.message);
        }
    }
    async update() {
        const { ctx } = this;
        try {
            
            const payload = ctx.request.body;
            const id=payload.id;
            // 基础格式校验
            ctx.validate({
                title: { type: 'string', required: false },
                content: { type: 'string', required: false }
            }, payload);

            const result = await ctx.service.memo.update(id, payload);
            if (result[0] === 0) {
                ctx.body = ctx.app.common.response.error(404, '备忘录不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '编辑失败: ' + error.message);
        }
    }
}

module.exports = MemoController;