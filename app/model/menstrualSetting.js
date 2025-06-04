module.exports = app => {
  const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

  const MenstrualSetting = app.model.define('menstrual_settings', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_openid: {
      type: STRING(64),
      allowNull: false,
      comment: '用户微信openid'
    },
    cycle_length: {
      type: INTEGER,
      defaultValue: 28,
      comment: '平均周期长度(天)'
    },
    period_length: {
      type: INTEGER,
      defaultValue: 5,
      comment: '平均经期天数'
    },
    remind_before_period: {
      type: INTEGER,
      defaultValue: 3,
      comment: '经期开始前提醒天数'
    },
    remind_before_ovulation: {
      type: INTEGER,
      defaultValue: 14,
      comment: '排卵期前提醒天数'
    },
    is_reminder_active: {
      type: BOOLEAN,
      defaultValue: true,
      comment: '是否启用提醒'
    }
  }, {
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    tableName: 'menstrual_settings',
    comment: '用户经期设置表'
  });
  MenstrualSetting.upsert = async function (values, options) {
    const record = await this.findOne({
      where: {
        user_openid: values.user_openid
      }
    });

    if (record) { // 更新
      const updated = await record.update(values, options);
      return [updated, false];
    }
    // 创建
    const created = await this.create(values, options);
    return [created, true];
  };
  return MenstrualSetting;
};