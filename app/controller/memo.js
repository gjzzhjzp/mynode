const Controller = require('egg').Controller;
const fse = require('fs-extra'); // 在文件顶部添加
const path = require('path');
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
            ctx.logger.info("result", result);
            ctx.body = ctx.app.common.response.success(result);
        } catch (e) {
            ctx.error(422, '数据验证失败', { errors: e.errors || [e.message] });
        }
    }
    async getList() {
        const { ctx } = this;
        try {
            const { page = 1, rows = 10, id } = ctx.query;
            const openid = ctx.state.user.openid;
            const result = await ctx.service.memo.getList({ openid, page, rows, id });
            ctx.body = ctx.app.common.response.success(result.list, { total: result.total });
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '查询失败: ' + error.message);
        }
    }
    async delete() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const ids = String(id).split(',').map(id => parseInt(id, 10)); // 将字符串转换为数字数组
            // 查询要删除的备忘录
            const memos = await ctx.model.Memo.findAll({
                where: { id: { [ctx.app.Sequelize.Op.in]: ids } }
            });
            console.log("memos------------", memos)
            // 删除关联的图片文件
            for (const memo of memos) {
                if (memo.image) {
                    const imagePaths = memo.image.split(',').map(img => img.trim()); // 分割图片路径
                    for (const img of imagePaths) {
                        const imagePath = path.join(ctx.app.config.baseDir, 'app/public', img.replace(/\/static\//g, ''));
                        await fse.remove(imagePath).catch(err => ctx.logger.error('删除图片失败:', err));
                    }
                }
            }


            const result = await ctx.service.memo.delete(ids);
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
            const id = payload.id;
            const ids = String(payload.id).split(',').map(id => parseInt(id, 10)); // 将字符串转换为数字数组
            // 查询要更新的备忘录
            const memos = await ctx.model.Memo.findAll({
                where: { id: { [ctx.app.Sequelize.Op.in]: ids } }
            });

            // 删除被替换的图片文件
            for (const memo of memos) {
                if (memo.image) {
                    const oldImagePaths = memo.image.split(',').map(img => img.trim()); // 分割旧图片路径
                    const newImagePaths = payload.image ? payload.image.split(',').map(img => img.trim()) : []; // 分割新图片路径

                    // 找出被删除的图片
                    const deletedImages = oldImagePaths.filter(img => !newImagePaths.includes(img));
                    for (const img of deletedImages) {
                        const imagePath = path.join(ctx.app.config.baseDir, 'app/public', img.replace(/\/static\//g, ''));
                        await fse.remove(imagePath).catch(err => ctx.logger.error('删除图片失败:', err));
                    }
                }
            }
            // 基础格式校验
            ctx.validate({
                title: { type: 'string', required: false },
                content: { type: 'string', required: false }
            }, payload);
            delete payload.id;
            const result = await ctx.service.memo.update(ids, payload);
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