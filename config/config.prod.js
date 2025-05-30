require('dotenv').config();
module.exports = {
  // 日志配置
  logger: {
    dir: '/data/wwwroot/wordpress/api/logs', // 日志存储路径
    level: 'INFO',                // 日志级别
    consoleLevel: 'INFO',         // 控制台日志级别
  },

  // 数据库配置
  sequelize: {
    dialect: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    timezone: '+08:00',
    define: {
      timestamps: false,
      freezeTableName: true,
    },
  },

  // 安全配置
  security: {
    csrf: {
      enable: false, // 关闭 CSRF 防护
    },
  },

  // 集群配置
  cluster: {
    listen: {
      port: 7002,
    },
  },

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '2h',
  },
};