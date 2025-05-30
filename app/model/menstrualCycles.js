module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT } = app.Sequelize;
  
    const MenstrualCycle = app.model.define('menstrual_cycles', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_openid: STRING(64),
      start_date: {
        type: DATE,
        get() {
          const rawValue = this.getDataValue('start_date');
          return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
        }
      },
      end_date: {
        type: DATE,
        get() {
          const rawValue = this.getDataValue('end_date');
          return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
        }
      },
      cycle_length: { type: INTEGER, defaultValue: 28 },
      period_length: INTEGER,
      flow_level: { type: INTEGER, defaultValue: 5 },
      pain_level: INTEGER,
      mood: STRING(50),
      notes: TEXT,
      remind_before_period: { type: INTEGER, defaultValue: 3 },
      remind_before_ovulation: { type: INTEGER, defaultValue: 14 },
      is_reminder_active: { type: INTEGER, defaultValue: 1 },
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
      tableName: 'menstrual_cycles'
    });
  
    // 添加统计方法
    MenstrualCycle.getStatistics = async function({ openid, startDate, endDate }) {
      const where = { user_openid: openid };
      
      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        where.start_date = {
          [app.Sequelize.Op.between]: [start, end]
        };
      }
  
      return await this.findAll({
        where,
        order: [['start_date', 'DESC']],
        raw: true
      });
    };
  
    // 获取最近一次记录
    MenstrualCycle.getLatestRecord = async function(openid) {
      return await this.findOne({
        where: { user_openid: openid },
        order: [['start_date', 'DESC']],
        raw: true
      });
    };
  
    // 更新方法
    MenstrualCycle.updateById = async function(id, openid, payload) {
      return await this.update(payload, {
        where: { id, user_openid: openid }
      });
    };
  
    // 删除方法
    MenstrualCycle.deleteById = async function(id, openid) {
      return await this.destroy({
        where: { id, user_openid: openid }
      });
    };
  
    return MenstrualCycle;
  };