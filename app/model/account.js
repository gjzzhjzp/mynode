module.exports = app => {
  const { STRING, DECIMAL, INTEGER, DATE } = app.Sequelize;

  const Account = app.model.define('accounts', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_openid: STRING(255),
    amount: DECIMAL(10, 2),
    type: INTEGER,
    category: STRING(50),
    date: {
      type: DATE,
      get() {
        const rawValue = this.getDataValue('date');
        return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
      }
    },
    description: STRING(255),
    created_at: {
      type: DATE,
      get() {
        const rawValue = this.getDataValue('created_at');
        return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
      }
    },
    updated_at: {
      type: DATE,
      get() {
        const rawValue = this.getDataValue('updated_at');
        return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
      }
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'accounts'
  });

  return Account;
};