module.exports = app => {
  const { STRING, DECIMAL, INTEGER, BOOLEAN } = app.Sequelize;

  const UserLimit = app.model.define('user_limits', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_openid: STRING(255),
    daily_limit: DECIMAL(10, 2),
    monthly_limit: DECIMAL(10, 2),
    yearly_limit: DECIMAL(10, 2),
    currency: {
      type: STRING(3),
      allowNull: false,
      defaultValue: '￥',
      comment: '记账币种'
    },
    open_daily: { type: BOOLEAN, defaultValue: false, allowNull: false } // 新增字段
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'user_limits'
  });

  return UserLimit;
};