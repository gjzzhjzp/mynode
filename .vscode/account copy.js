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
  // 添加统计方法
  Account.getStatistics = async function({ openid, type, startDate, endDate, summary = true }) {
    const where = { user_openid: openid };
  
    // 处理时间范围
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      where.date = {
        [app.Sequelize.Op.between]: [startDateOnly, endDateOnly]
      };
    } else if (!summary) {
      // 如果没有时间范围且不是汇总统计，默认统计当前月
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      where.date = {
        [app.Sequelize.Op.between]: [startOfMonth, endOfMonth]
      };
    }
  
    // 定义统计字段
    let attributes = [
      [app.Sequelize.fn('SUM', app.Sequelize.col('amount')), 'total_amount'],
      'type',
      'category'
    ];
  
    // 定义分组条件
    let groupBy = ['type', 'category'];
  
    // 处理不同类型的统计
    if (!summary) {
      switch (type) {
        case 'day':
          groupBy = [app.Sequelize.fn('DATE', app.Sequelize.col('date')), 'type', 'category'];
          attributes.push(app.Sequelize.fn('DATE', app.Sequelize.col('date')));
          break;
        case 'month':
          groupBy = [app.Sequelize.fn('MONTH', app.Sequelize.col('date')), 'type', 'category'];
          attributes.push(app.Sequelize.fn('MONTH', app.Sequelize.col('date')));
          break;
        case 'year':
          groupBy = [app.Sequelize.fn('YEAR', app.Sequelize.col('date')), 'type', 'category'];
          attributes.push(app.Sequelize.fn('YEAR', app.Sequelize.col('date')));
          break;
      }
    } else {
      // 汇总统计只按类型分组
      groupBy = ['type'];
      attributes = [
        [app.Sequelize.fn('SUM', app.Sequelize.col('amount')), 'total_amount'],
        'type'
      ];
    }
  
    return await this.findAll({
      attributes,
      where,
      group: groupBy,
      raw: true
    });
  };
  return Account;
};