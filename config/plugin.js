/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  // mongoose:{
  //   enable: true,
  //   package: 'egg-mongoose',
  // }
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt'
  },
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  schedule: {
    enable: true,
    package: 'egg-schedule',
  }
};
