module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT, BOOLEAN } = app.Sequelize;

    const MenstrualDailyRecords = app.model.define('menstrual_daily_records', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_openid: {
            type: STRING(64),
            allowNull: false,
            comment: '用户微信openid'
        },
        record_date: {
            type: DATE,
            allowNull: false,
            comment: '记录日期',
            get() {
                const rawValue = this.getDataValue('record_date');
                return rawValue ? rawValue.toLocaleDateString('zh-CN') : null;
            }
        },
        is_period: {
            type: BOOLEAN,
            defaultValue: false,
            comment: '是否来大姨妈'
        },
        flow_level: {
            type: INTEGER,
            comment: '流量等级(1-10)'
        },
        pain_level: {
            type: INTEGER,
            comment: '痛经程度(1-10)'
        },
        mood: {
            type: STRING(50),
            comment: '情绪状态'
        },
        notes: {
            type: TEXT,
            comment: '备注'
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'menstrual_daily_records',
        comment: '每日经期记录表',
        indexes: [
            {
                unique: true,
                fields: ['user_openid', 'record_date'],
                name: 'user_date_unique'
            }
        ]
    });
    // 在模型定义后添加
    MenstrualDailyRecords.upsert = async function (values, options) {
        const queryDate = new Date(values.record_date);
        queryDate.setHours(0, 0, 0, 0); // 设置为当天开始时间
        const record = await this.findOne({
            where: {
                user_openid: values.user_openid,
                record_date: queryDate
            }
        });
        // console.log("-------------------",values,options);
        if (record) { // 更新
            const updated = await record.update(values, options);
            return [updated, false];
        }
        // 创建
        const created = await MenstrualDailyRecords.create(values, options);
        return [created, true];
    };

    return MenstrualDailyRecords;
};