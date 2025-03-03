// app/common/response.js
module.exports = {
    // 成功响应
    success(data = null, extra = {}) {
      return {
        code: 200,
        message: 'success',
        data,
        ...extra,
      };
    },
  
    // 错误响应
    error(code, message, details = null) {
      return {
        code,
        message,
        details: this.ctx.app.config.env === 'prod' ? null : details, // 生产环境隐藏细节
      };
    }
  };