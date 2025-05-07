// app/controller/user.js
const Controller = require('egg').Controller;
const axios = require('axios');
const ExcelJS = require('exceljs');
const path = require('path');
class accountController extends Controller {
    async addAccount() {
        const { ctx } = this;
        try {
            // 获取请求参数
            const { amount, type, category, description, date } = ctx.request.body;

            // 获取当前用户ID
            const openid = ctx.state.user.openid;
            // 处理日期
            const inputDate = new Date(date);
            const now = new Date();
            const isSameDay = inputDate.toDateString() === now.toDateString();

            // 设置 created_at
            const createdAt = isSameDay ? now : new Date(inputDate.setHours(23, 59, 59, 999));
            // 构造账单数据
            // 构造账单数据
            const accountData = {
                user_openid: openid,
                amount: parseFloat(amount),
                type: type,
                category: category,
                date: inputDate, // 使用处理后的日期
                description: description || '',
                created_at: createdAt
            };
            ctx.logger.info(accountData);
            // 调用Service层
            const result = await ctx.service.account.createAccount(accountData);

            ctx.body = ctx.app.common.response.success({
                id: result.id,
                ...accountData
            });

        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '添加账单失败: ' + error.message);
        }
    }
    async getAccountList() {
        const { ctx } = this;
        try {
            ctx.logger.info("openid-------------123", ctx.state.user);
            const { page, rows, id } = ctx.query;
            const openid = ctx.state.user.openid;
            ctx.logger.info("openid-------------", openid);
            const { list, total } = await ctx.service.account.getAccountList({ page, rows, openid, id, order: [['created_at', 'DESC']] });
            ctx.body = ctx.app.common.response.success(list, {}, total);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取账单失败: ' + error.message);
        }
    }
    async getStatisticsByfl() {
        const { ctx } = this;
        try {
            const { type, startDate, endDate, year, month, day } = ctx.query;
            const openid = ctx.state.user.openid;
            let { queryStartDate, queryEndDate } = ctx.service.account.getQueryStartEnd({
                year, month, day, startDate, endDate
            })
            console.log("queryStartDate", queryStartDate);
            console.log("queryEndDate", queryEndDate);
            const statistics = await ctx.service.account.getStatisticsByfl({
                openid,
                type: type || 'day',
                startDate: queryStartDate,
                endDate: queryEndDate
            });

            ctx.body = ctx.app.common.response.success(statistics);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取统计失败: ' + error.message);
        }
    }
    async getStatisticsByflList() {
        const { ctx } = this;
        try {
            const { startDate, endDate, type, year, month, day, page, rows } = ctx.query;
            const openid = ctx.state.user.openid;
            let { queryStartDate, queryEndDate } = ctx.service.account.getQueryStartEnd({
                year, month, day, startDate, endDate
            })
            const { list, total } = await ctx.service.account.getStatisticsByflList({
                page,
                rows,
                openid,
                type: type || 'day',
                startDate: queryStartDate,
                endDate: queryEndDate
            });

            ctx.body = ctx.app.common.response.success(list, {}, total);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取统计失败: ' + error.message);
        }
    }
    async getStatistics() {
        const { ctx } = this;
        try {
            const { startDate, endDate, type, year, month, day } = ctx.query;
            const openid = ctx.state.user.openid;
            let { queryStartDate, queryEndDate } = ctx.service.account.getQueryStartEnd({
                year, month, day, startDate, endDate
            })
            console.log("queryStartDate", queryStartDate);
            console.log("queryStartDate", queryEndDate);
            const statistics = await ctx.service.account.getStatistics({
                openid,
                type: type || 'day',
                startDate: queryStartDate,
                endDate: queryEndDate
            });
            ctx.body = ctx.app.common.response.success(statistics);
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '获取统计失败: ' + error.message);
        }
    }

    async update() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const payload = ctx.request.body;
            // 基础格式校验
            // ctx.validate({
            //     amount: { type: 'number', required: false },
            //     type: { type: 'string', required: false },
            //     category: { type: 'string', required: false },
            //     date: { type: 'date', required: false },
            //     description: { type: 'string', required: false }
            // }, payload);
            // 处理日期
            if (payload.date) {
                const inputDate = new Date(payload.date);
                const now = new Date();
                const isSameDay = inputDate.toDateString() === now.toDateString();

                // 如果不是同一天，设置创建时间为当天的23:59
                if (!isSameDay) {
                    inputDate.setHours(23, 59, 59, 999);
                    payload.created_at = inputDate; // 更新创建时间
                }
            }
            const result = await ctx.service.account.update(id, payload);
            if (result[0] === 0) {
                ctx.body = ctx.app.common.response.error(404, '账单不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '编辑失败: ' + error.message);
        }
    }
    async delete() {
        const { ctx } = this;
        try {
            const { id } = ctx.request.body;
            const result = await ctx.service.account.delete(id);
            if (result === 0) {
                ctx.body = ctx.app.common.response.error(404, '账单不存在');
            } else {
                ctx.body = ctx.app.common.response.success({ id });
            }
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, '删除失败: ' + error.message);
        }
    }
    async exportYearly() {
        const { ctx } = this;
        try {
            const { year } = ctx.query;
            const openid = ctx.state.user.openid;

            if (!year || !/^\d{4}$/.test(year)) {
                ctx.throw(400, '年份格式错误');
            }

            // 获取账单数据
            const bills = await ctx.model.Account.getYearlyBills(openid, year);

            // 生成 Excel 文件
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('账单');

            // 添加表头
            worksheet.columns = [
                { header: '日期', key: 'date', width: 20 },
                { header: '类型', key: 'type', width: 10 },
                { header: '类别', key: 'category', width: 15 },
                { header: '金额', key: 'amount', width: 15 },
                { header: '描述', key: 'description', width: 30 }
            ];
            // 修改数据添加部分
            const categoryMap = new Map();
            const categories = await ctx.model.Category.findAll();

            // 构建类别映射
            categories.forEach(category => {
                categoryMap.set(category.value, category.name);
            });
            // 添加数据
            bills.forEach(bill => {
                worksheet.addRow({
                    date: bill.date,
                    type: bill.type ? '收入' : '支出',
                    category: categoryMap.get(bill.category) || bill.category,
                    amount: bill.amount,
                    description: bill.description
                });
            });

            // 保存文件到服务器
            const filePath = `app/public/exports/${year}_账单_${openid}_${Date.now()}.xlsx`;
            await workbook.xlsx.writeFile(filePath);

            // 返回文件地址
            const fileUrl = `/static/exports/${path.basename(filePath)}`;
            ctx.body = ctx.app.common.response.success({ url: fileUrl });
        } catch (error) {
            ctx.body = ctx.app.common.response.error(500, `导出失败: ${error.message}`);
        }
    }
}
module.exports = accountController;
