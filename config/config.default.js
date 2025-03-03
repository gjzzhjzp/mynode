/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1740633463032_9534';

  // add your middleware config here
  config.middleware = [
    "errorHandler"
  ];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };
  // config.mongoose = {
  //   client: {
  //     url: 'mongodb://127.0.0.1:27017/text',
  //     options: {},
  //   },
  // };
  config.mysql = {
    client: {
      host: '47.108.224.146',     // MySQL 地址
      port: '3306',          // 端口
      user: 'root',          // 用户名
      password: 'DiwNjHlt', // 密码
      database: 'notebook', // 数据库名
    },
    app: true,     // 挂载到 app 实例
    agent: false,  // 不挂载到 agent 实例
  };
  // 关闭csrf防护
  config.security = {
    csrf: {
      enable: false,
    },

  };
  config.cluster = {
    listen: {
      port: 7002,
    },
  }
  config.thirdApi={
    xcx:{
      url:"https://api.weixin.qq.com/sns/jscode2session",
      appid:"wx979fff2cbd6c3e80",
      secret:"5b367c9cfe70d4a5eb3f1a1f2142b9e1",
    }
  }
  return {
    ...config,
    ...userConfig,
  };
};
