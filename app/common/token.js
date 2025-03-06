const crypto = require('crypto');
// 小程序端无cookie，此方法废弃
const generateToken = (ctx, length = 32) => {
    const token = crypto.randomBytes(length).toString('hex');
    // 将token存储到cookie中
    ctx.cookies.set('csrfToken', token, {
      httpOnly: false, // 仅服务器可访问
      secure: false,//process.env.NODE_ENV === 'production', // 生产环境启用https
      sameSite: 'strict', // 防止CSRF攻击
      maxAge: 1000 * 60 * 60 * 24 // 1天有效期
    });
   
 
    return token;
  };

module.exports = {
  generateToken
};