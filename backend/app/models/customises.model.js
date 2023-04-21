module.exports = (sequelize, DataTypes) => {
    const Customises = sequelize.define("customises", {
        meta_name: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        meta_seq: {
            type: DataTypes.STRING(4),
            allowNull: false
        },
        meta_min_tk: {
            type: DataTypes.INTEGER({ length : 1 }),
            allowNull: false
        },
        meta_max_tk: {
            type: DataTypes.INTEGER({ length : 1 }),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false
        }
    });

    return Customises;
};