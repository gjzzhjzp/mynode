module.exports = app => {
    const { STRING, INTEGER, DATE, TEXT, FLOAT,Op } = app.Sequelize;

    const MenstrualPeriod = app.model.define('menstrual_periods', {
        id: { type: INTEGER, primaryKey: true, autoIncrement: true },
        user_openid: {
            type: STRING(64),
            allowNull: false,
            comment: '用户微信openid'
        },
        start_date: {
            type: DATE,
            allowNull: false,
            comment: '开始日期',
            get() {
                const rawValue = this.getDataValue('start_date');
                return rawValue ? rawValue.toISOString().split('T')[0] : null;
            }
        },
        end_date: {
            type: DATE,
            allowNull: false,
            comment: '结束日期',
            get() {
                const rawValue = this.getDataValue('end_date');
                return rawValue ? rawValue.toISOString().split('T')[0] : null;
            }
        },
        cycle_length: {
            type: INTEGER,
            comment: '周期长度(天)'
        },
        period_length: {
            type: INTEGER,
            comment: '经期天数'
        },
        avg_flow_level: {
            type: FLOAT,
            comment: '平均流量等级(1-10)'
        },
        avg_pain_level: {
            type: FLOAT,
            comment: '平均痛经程度(1-10)'
        },
        notes: {
            type: TEXT,
            comment: '备注'
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        tableName: 'menstrual_periods',
        comment: '月经周期记录表'
    });

    // 添加实例方法
    MenstrualPeriod.prototype.getPeriodDetails = async function () {
        const details = {
            startDate: this.start_date,
            endDate: this.end_date,
            duration: this.period_length,
            avgFlow: this.avg_flow_level,
            avgPain: this.avg_pain_level
        };
        return details;
    };
    // 添加upsert类方法
    MenstrualPeriod.upsert = async function (values, options = {}) {
       
        // 转换日期格式
        const processedValues = {
            ...values,
            start_date: values.start_date ? new Date(values.start_date) : null,
            end_date: values.end_date ? new Date(values.end_date) : null
        };
        const record = await this.findOne({
            where: {
                user_openid: processedValues.user_openid,
                [Op.or]: [
                    { start_date: processedValues.start_date },
                    { end_date: processedValues.end_date }
                ]
            }
        });
        if (record) {
            // 更新现有记录
            const updated = await record.update(processedValues, options);
            return [updated, false];
        }
        // 创建新记录
        const created = await MenstrualPeriod.create(processedValues, options);
        return [created, true];
    };

    return MenstrualPeriod;
};