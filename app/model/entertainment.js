module.exports = app => {
  const { STRING, INTEGER, TEXT } = app.Sequelize;

  const Entertainment = app.model.define('entertainment', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    type: { type: STRING(50), allowNull: false },
    name: { type: STRING(255), allowNull: false },
    cn_name: { type: STRING(255), allowNull: false },
    link: { type: STRING(255) },
    image_url: { type: STRING(255) },
    status: { type: INTEGER, defaultValue: 1 }
  }, {
    timestamps: true,
    paranoid: false,
    underscored: true,
    tableName: 'entertainment'
  });

  Entertainment.queryList = async ({ page = 1, rows = 10, type, status }) => {
    const where = {};
    if (type) where.type = type;
    if (status !== undefined) where.status = status;
    console.log("------------------", where);
    const result = await Entertainment.findAndCountAll({
      where,
      limit: parseInt(rows, 10),
      offset: (parseInt(page, 10) - 1) * parseInt(rows, 10),
      order: [['created_at', 'DESC']]
    });

    return { list: result.rows, total: result.count };
  };

  return Entertainment;
};