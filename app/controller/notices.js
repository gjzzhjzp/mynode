const { Controller } = require('egg');

class NoticesController extends Controller {
    async getone() {
        const { ctx } = this;
        try {
            const notice = await ctx.service.notice.getLatestPublishedNotice();
            ctx.body = ctx.app.common.response.success(notice);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取公告失败: ' + error.message);
        }
    }
}

module.exports = NoticesController;