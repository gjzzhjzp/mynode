const { Service } = require('egg');
const axios = require('axios');

class HttpService extends Service {
  // 通用请求方法
  async request(config) {
    try {
      const { data } = await axios({
        timeout: 5000, // 默认超时5秒
        ...config,
        headers: {
          'Content-Type': 'application/json',
          ...config.headers,
        },
      });
      return data;
    } catch (error) {
      this.ctx.logger.error('HTTP请求失败', error);
      throw new Error(`请求失败: ${error.message}`);
    }
  }

  // GET 快捷方法
  async get(url, params = {}, headers = {}) {
    return this.request({ method: 'GET', url, params, headers });
  }

  // POST 快捷方法
  async post(url, data = {}, headers = {}) {
    return this.request({ method: 'POST', url, data, headers });
  }
}

module.exports = HttpService;