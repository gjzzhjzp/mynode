module.exports = app => {
    const { STRING, INTEGER, BOOLEAN } = app.Sequelize;

    const Currency = app.model.define('currencies', {
        id: {
            type: INTEGER,
            primaryKey: true,
            autoIncrement: true,
            comment: '自增主键'
        },
        code: {
            type: STRING(3),
            allowNull: false,
            unique: true,
            comment: '币种代码'
        },
        name: {
            type: STRING(20),
            allowNull: false,
            comment: '币种名称'
        },
        symbol: {
            type: STRING(5),
            allowNull: false,
            comment: '币种符号'
        },
        sort_order: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0,
            comment: '排序号'
        },
        is_enabled: {
            type: BOOLEAN,
            allowNull: false,
            defaultValue: true,
            comment: '启用状态'
        }
    }, {
        tableName: 'currencies',
        timestamps: false
    });

    return Currency;
}; 