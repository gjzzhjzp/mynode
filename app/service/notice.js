const { Service } = require('egg');

class NoticeService extends Service {
    async getLatestPublishedNotice() {
        return await this.ctx.model.Notice.findOne({
            where: { is_published: true },
            order: [['created_at', 'DESC']]
        });
    }
}

module.exports = NoticeService;