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
      host: '47.108.224.146',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'notebook',
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
      secret: '5cb3e0edc9cb075e2be5a6c3305e2cfe1d379909ce494bec444445115f80fa92',
      expiresIn: '2h',
    },
  };