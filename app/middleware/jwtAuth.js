module.exports = options => {
    return async function jwtAuth(ctx, next) {
        // 检查是否在忽略列表中
        if (options.ignore && options.ignore.includes(ctx.path)) {
            await next();
            return;
        }
        // 验证CSRF token
        // const csrfToken = ctx.request.header['x-csrf-token'];
        // console.log("csrfToken",csrfToken,ctx.cookies.get('csrfToken'));
        // if (!csrfToken || csrfToken !== ctx.cookies.get('csrfToken')) {
        //     ctx.status = 403;
        //     ctx.body = {
        //         code: 403,
        //         message: 'CSRF token验证失败'
        //     };
        //     return;
        // }
        const token = ctx.request.header.authorization?.replace('Bearer ', '');
        if (token) {
            try {
                // 验证token
                console.log("token",token);
                console.log("options.secret",options.secret);
                const decoded = ctx.app.jwt.verify(token, options.secret);
                ctx.state.user = decoded; // 将解码后的用户信息存入ctx
                await next();
            } catch (err) {
                ctx.status = 401;
                ctx.body = {
                    code: 401,
                    message: 'Token验证失败'
                };
            }
        } else {
            ctx.status = 401;
            ctx.body = {
                code: 401,
                message: '未提供Token'
            };
        }
    };
};