module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("orders", {
    total_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    table_num: {
      type: DataTypes.STRING(4),
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    additional_info: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    payment_1: {
      type: DataTypes.STRING
    },
    payment_1: {
      type: DataTypes.STRING
    }
  });

  return Orders;
};