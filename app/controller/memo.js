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
            console.log("payload1111", payload, ctx.state.user);
            const result = await ctx.service.memo.create(payload);
            ctx.success(result);
        } catch (e) {
            ctx.error(422, '数据验证失败', { errors: e.errors || [e.message] });
        }
    }
}

module.exports = MemoController;