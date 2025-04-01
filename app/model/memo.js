module.exports = app => {
    const { STRING, TEXT, DATE, ENUM, BOOLEAN, INTEGER } = app.Sequelize;

    return app.model.define('memos', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '主键ID'
        },
        user_openid: {
            type: STRING(255),
            allowNull: false,
            comment: '关联微信用户'
        },
        title: {
            type: STRING(100),
            allowNull: false,
            validate: {
                len: [1, 100]
            },
            comment: '备忘录标题'
        },
        content: {
            type: TEXT,
            comment: '详细内容'
        },
        status: {
            type: ENUM('pending', 'done', 'archived'),
            defaultValue: 'pending',
            comment: '任务状态'
        },
        is_important: {
            type: BOOLEAN,
            defaultValue: false,
            comment: '重要标记'
        },
        reminder_time: {
            type: DATE,
            comment: '提醒时间(UTC存储)',
            get() {
                const rawValue = this.getDataValue('reminder_time');
                return rawValue ? new Date(rawValue.getTime() + (8 * 60 * 60 * 1000)) : null;
            }
        }
    }, {
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        paranoid: true, // 启用软删除
        deletedAt: 'deleted_at',
        comment: '用户备忘录',
        indexes: [
            {
                name: 'idx_user_status',
                fields: ['user_openid', 'status']
            },
            {
                name: 'idx_reminder',
                fields: ['reminder_time']
            }
        ],
        hooks: {
            beforeValidate: (memo) => {
                if (memo.reminder_time) {
                    memo.reminder_time = new Date(memo.reminder_time.getTime() - (8 * 60 * 60 * 1000));
                }
            }
        }
    });
};