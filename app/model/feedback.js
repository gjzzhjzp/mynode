module.exports = app => {
    const { STRING, TEXT, INTEGER, DATE } = app.Sequelize;
  
    const Feedback = app.model.define('feedback', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_openid: { type: STRING(255), allowNull: false },
      content: { type: TEXT, allowNull: false },
      contact_info: { type: STRING(100) },
      status: { type: INTEGER, defaultValue: 0 },
      created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: app.Sequelize.NOW },
    });
  
    return Feedback;
  };