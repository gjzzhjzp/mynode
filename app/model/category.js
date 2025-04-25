module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const Category = app.model.define('categories', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING(50),
    type: INTEGER,
    value: STRING(100),
    icon: STRING(100),
    user_openid: {
      type: STRING(255),
      allowNull: true,
      defaultValue: null,
      comment: '用户唯一标识'
    },
    created_at: DATE
  }, {
    timestamps: false,
    tableName: 'categories'
  });

  return Category;
};