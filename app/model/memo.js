module.exports = app => {
    const { STRING, TEXT, DATE, ENUM, BOOLEAN, INTEGER } = app.Sequelize;

    const Memo = app.model.define('memos', {
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
                return rawValue ? rawValue.toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' }) : null;
            }
        },
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
        ]
        // hooks: {
        //     beforeValidate: (memo) => {
        //         if (memo.reminder_time) {
        //             memo.reminder_time = new Date(memo.reminder_time.getTime() - (8 * 60 * 60 * 1000));
        //         }
        //     }
        // }
    });
    // 新增查询方法
    Memo.getList = async ({ openid, limit, offset }) => {
        const result = await Memo.findAndCountAll({
            where: { user_openid: openid },
            order: [['created_at', 'DESC']],
            limit: limit,
            offset: offset
        });
        return {
            list: result.rows,
            total: result.count
        };
    };
    // 新增删除方法
    Memo.deleteById = async (id, openid) => {
        return await Memo.destroy({
            where: { id, user_openid: openid }
        });
    };
    // 新增编辑方法
    Memo.updateById = async (id, openid, payload) => {
        return await Memo.update(payload, {
            where: { id, user_openid: openid }
        });
    };
    // 新增查询方法：查找需要提醒的备忘录
    Memo.getReminders = async () => {
        const now = new Date();
        console.log("now--------------------", now);
        // const utcNow = new Date(now.getTime() - (8 * 60 * 60 * 1000)); // 将当前时间转换为 UTC 时间
        const list = await Memo.findAll({
            where: {
                reminder_time: {
                    [app.Sequelize.Op.lte]: now,
                    [app.Sequelize.Op.ne]: null
                } // 查找 reminder_time <= 当前时间的记录
            }
        });
        console.log("list--------------------", list);
        return list;
    };

    return Memo;
};