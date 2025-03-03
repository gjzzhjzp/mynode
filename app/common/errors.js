// app/common/errors.js
class BizError extends Error {
    constructor(code, message, details) {
      super(message);
      this.code = code;     // 业务错误码 (如 1001)
      this.details = details; // 错误详情
      this.isBizError = true; // 标识为业务错误
    }
  }
  
  class HttpError extends Error {
    constructor(status, message) {
      super(message);
      this.status = status; // HTTP 状态码 (如 404)
    }
  }
  
  module.exports = { BizError, HttpError };