module.exports = app => {
    const { STRING, DECIMAL, INTEGER, DATE } = app.Sequelize;
  
    const Account = app.model.define('accounts', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_openid: STRING(255),
      amount: DECIMAL(10, 2),
      type: INTEGER,
      category: STRING(50),
      date: DATE,
      description: STRING(255),
    }, {
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      tableName: 'accounts'
    });
  
    return Account;
  };