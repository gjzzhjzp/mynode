module.exports = app => {
    const { STRING, INTEGER, TEXT, BOOLEAN, DATE } = app.Sequelize;

    const Notice = app.model.define('notices', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增主键'
        },
        title: {
            type: STRING(100),
            allowNull: false,
            comment: '公告标题'
        },
        content: {
            type: TEXT,
            allowNull: false,
            comment: '公告内容'
        },
        is_published: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: false,
            comment: '发布状态'
        },
        created_at: {
            type: DATE,
            allowNull: false,
            defaultValue: app.Sequelize.NOW,
            comment: '创建时间'
        },
        updated_at: {
            type: DATE,
            allowNull: false,
            defaultValue: app.Sequelize.NOW,
            comment: '更新时间'
        }
    }, {
        tableName: 'notices',
        timestamps: false
    });

    return Notice;
};