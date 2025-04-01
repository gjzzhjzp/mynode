/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./router/common')(app);
  require('./router/user')(app);
  require('./router/account')(app);
  require('./router/userLimit')(app);
  require('./router/memos')(app);
};

