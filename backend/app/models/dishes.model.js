module.exports = (sequelize, DataTypes) => {
  const Dishes = sequelize.define("dishes", {
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    short_name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    full_description: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    price_ori: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    price_cur: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    is_instock: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    is_valid: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    pict_url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tags: {
      type: DataTypes.INTEGER({ length : 3 }),
      allowNull: false
    }
  });

  return Dishes;
};