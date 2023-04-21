module.exports = (sequelize, DataTypes) => {
    const Dishtypes = sequelize.define("dishtypes", {
        type: {
            type: DataTypes.STRING(32),
            allowNull: false
        },
        type_seq: {
            type: DataTypes.INTEGER({ length : 5 }),
            allowNull: false
        }
    });

    return Dishtypes;
};