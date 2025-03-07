// app/middleware/error_handler.js
const { BizError, HttpError } = require('../common/errors');

module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
      
      // 处理 404
      if (ctx.status === 404 && !ctx.body) {
        throw new HttpError(404, '资源未找到');
      }

    } catch (err) {
      ctx.logger.error('[全局错误]', err);

      // 已知错误处理
      if (err.isBizError) { // 业务错误
        ctx.body = ctx.app.common.response.error(err.code, err.message, err.details);
        ctx.status = 200;
      } else if (err.status) { // HTTP 错误
        ctx.body = ctx.app.common.response.error(err.status, err.message);
        ctx.status = err.status;
      } else { // 未知系统错误
        ctx.body = ctx.response.error(500, 
          ctx.app.config.env === 'prod' ? '系统异常' : err.message,
          ctx.app.config.env === 'prod' ? null : err.stack
        );
        ctx.status = 500;
      }
    }
  };
};