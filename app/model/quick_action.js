module.exports = app => {
    const { STRING, INTEGER, DATE } = app.Sequelize;
  
    const QuickAction = app.model.define('quick_actions', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING(50), allowNull: false },
      icon: { type: STRING(100), allowNull: false },
      cn_name: { type: STRING(50), allowNull: false },
      path: { type: STRING(255), allowNull: false },
      status: { type: INTEGER, defaultValue: 1 },
      sort_order: { type: INTEGER, defaultValue: 0 },
      created_at: { type: DATE, defaultValue: app.Sequelize.NOW },
      updated_at: { type: DATE, defaultValue: app.Sequelize.NOW },
    });
  
    return QuickAction;
  };