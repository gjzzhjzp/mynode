const { Controller } = require('egg');

class CurrencyController extends Controller {
    async list() {
        const { ctx } = this;
        try {
            const currencies = await ctx.model.Currency.findAll({
                where: { is_enabled: true },
                order: [['sort_order', 'ASC']]
            });
            ctx.body = ctx.app.common.response.success(currencies);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取币种列表失败: ' + error.message);
        }
    }
}

module.exports = CurrencyController;