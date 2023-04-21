module.exports = (sequelize, DataTypes) => {
  const Details = sequelize.define("details", {
    quantity: {
      type: DataTypes.INTEGER({ length : 3 }),
      allowNull: false
    },
    sub_price: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    customise_ids: {
      type: DataTypes.STRING(256),
      allowNull: false
    },

  });


  return Details;
};