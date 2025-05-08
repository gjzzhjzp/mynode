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
  Account.getStatisticsByfl = async function ({ openid, type, startDate, endDate }) {
    const where = { user_openid: openid };
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // 只保留年月日部分
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      where.date = {
        [app.Sequelize.Op.between]: [startDateOnly, endDateOnly]
      };
      app.logger.info('getStatistics:', openid, type, startDateOnly, endDateOnly);
    }

    let groupBy;
    let attributes = [
      [app.Sequelize.fn('SUM', app.Sequelize.col('amount')), 'total_amount'],
      'type',
      'category'
    ];

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
      default:
        groupBy = ['type', 'category'];
    }
    app.logger.info("groupBy:", groupBy);
    app.logger.info("attributes:", attributes);
    app.logger.info("where:", where);
    return await this.findAll({
      attributes,
      where,
      group: groupBy,
      raw: true
    });
  }
  Account.getStatistics = async function ({ openid, startDate, endDate }) {
    const where = { user_openid: openid };
    app.logger.info('getStatistics:', startDate, endDate);
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // 只保留年月日部分
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());

      where.created_at = {
        [app.Sequelize.Op.between]: [startDateOnly, endDateOnly]
      };
      app.logger.info('getStatistics:', openid, startDateOnly, endDateOnly);
    }

    return await this.findAll({
      attributes: [
        'type',
        [app.Sequelize.fn('SUM', app.Sequelize.col('amount')), 'total_amount']
      ],
      where: where,
      group: ['type'],
      raw: true
    });

  }
  // 给用户发送通知
  Account.getUsersForNotification = async function () {
    return await this.findAll({
      attributes: [
        [app.Sequelize.fn('DISTINCT', app.Sequelize.col('user_openid')), 'openid']
      ],
      raw: true
    });
  };
  // 新增编辑方法
  Account.updateById = async (id, openid, payload) => {
    return await Account.update(payload, {
      where: { id, user_openid: openid }
    });
  };
  // 新增删除方法
  Account.deleteById = async (id, openid) => {
    return await Account.destroy({
      where: { id, user_openid: openid }
    });
  };
  // 按年导出账单
  Account.getYearlyBills = async function (openid, year) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31);

    return await this.findAll({
      where: {
        user_openid: openid,
        date: { [app.Sequelize.Op.between]: [startDate, endDate] }
      },
      order: [['created_at', 'DESC']],
      raw: true
    });
  };
  return Account;
};