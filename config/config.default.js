/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
require('dotenv').config();
console.log('MYSQL_HOST:', process.env.MYSQL_HOST);
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
    "errorHandler",
    "jwtAuth"
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
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    },
    pool: {
      // 连接池的配置
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    app: true,     // 挂载到 app 实例
    agent: false,  // 不挂载到 agent 实例
  };
  // 关闭csrf防护（小程序端无cookie，故关闭防护）
  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true, // 如果使用JSON API建议开启
      cookieName: 'csrfToken', // 自定义cookie名称
      headerName: 'x-csrf-token', // 自定义header名称
      ignore: [
        "/test",
        "/login",
        "/xcxm",
        "/api/v1"
      ]
    },
  };
  config.sequelize = {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      freezeTableName: true,
    },
  };
  config.cluster = {
    listen: {
      port: 7002,
    },
  }
  config.jwt = {
    enable: true,
    secret: process.env.JWT_SECRET,
    ignore: ["/test", '/login', '/api/v1', '/xcxm'],
    expiresIn: '2h'
  };
  config.jwtAuth = {
    enable: true,
    secret: config.jwt.secret,
    ignore: config.jwt.ignore // 传递忽略列表
  }

  config.thirdApi = {
    xcx: {
      url: "https://api.weixin.qq.com",
      appid: "wx979fff2cbd6c3e80",
      secret: "5b367c9cfe70d4a5eb3f1a1f2142b9e1",
      miniprogram_state: "formal",//developer为开发版；trial为体验版；formal为正式版；
      tmplIds: {
        overspend: "cZopylf8s_GkMnbN9Zk3mVCGw3ikIGP-tp0Y8YutwAs",
        daily: "fue7EGWjzjmDhZMMXeFWLq4ZG0MpfquG2y6JhMHBDzk",
        memo: "P-sAPOjEq9q435cisnwqC0qJeMG5YyYGP5QzR3GHD1Y"
      }
    }
  }
  config.customLoader = {
    common: {
      directory: 'app/common', // 指定加载目录
      inject: 'app',          // 注入到app对象
      loadunit: true,         // 支持在单元测试时加载
    }
  };
  config.env = "prod";
  return {
    ...config,
    ...userConfig,
  };
};
