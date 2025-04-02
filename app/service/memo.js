const Service = require('egg').Service;

class MemoService extends Service {
    async create(payload) {
        const { ctx } = this;

        // 参数校验（保持与控制器层不同的验证逻辑）
        const rules = {
            title: { type: 'string', max: 100 },
            content: { type: 'string', required: false },
            reminder_time: {
                type: 'datetime',
                required: false,
                format: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/
            }
        };
        ctx.validate(rules, payload);

        // 处理时区（前端传北京时间 -> 存储为UTC）
        if (payload.reminder_time) {
            const beijingOffset = 8 * 60 * 60 * 1000; // UTC+8 的毫秒数
            const localDate = new Date(payload.reminder_time);
            payload.reminder_time = new Date(localDate.getTime() - beijingOffset);
        }
        console.log("payload2222", payload, ctx.state.user.openid)
        // 关联当前用户
        return ctx.model.Memo.create({
            ...payload,
            user_openid: ctx.state.user.openid
        });
    }
    // 新增查询服务
    async getList({ openid, page, rows }) {
        const { ctx } = this;
        const limit = parseInt(rows, 10);  // 确保rows是数字
        const offset = (parseInt(page, 10) - 1) * limit;  // 确保page是数字并计算偏移量
        return await ctx.model.Memo.getList({ openid, limit, offset });
    }
    // 新增删除服务
    async delete(id) {
        const { ctx } = this;
        const openid = ctx.state.user.openid;
        return await ctx.model.Memo.deleteById(id, openid);
    }
    // 新增编辑服务
    async update(id, payload) {
        const { ctx } = this;
        const openid = ctx.state.user.openid;
        return await ctx.model.Memo.updateById(id, openid, payload);
    }
}

module.exports = MemoService;