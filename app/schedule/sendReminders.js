module.exports = {
    schedule: {
        interval: '1m', // 每分钟执行一次
        type: 'worker', // 指定一个 worker 执行
    },
    async task(ctx) {
        await ctx.service.memo.sendReminders();
    }
};