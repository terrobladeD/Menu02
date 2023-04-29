module.exports = (sequelize, DataTypes) => {
  const Details = sequelize.define("details", {
    quantity: {
      type: DataTypes.INTEGER({ length: 3 }),
      allowNull: false
    },
    sub_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    customise_names: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    dish_name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },

  });


  return Details;
};