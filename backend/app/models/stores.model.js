module.exports = (sequelize, DataTypes) => {
  const Stores = sequelize.define("stores", {
    id: {
      primaryKey: true,
      type: DataTypes.STRING, // or Sequelize.UUID Sequelize& STRING is the same thing
      defaultValue: DataTypes.UUIDV4 // or a custom hash function
    },
    name: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    contract_length: {
      type: DataTypes.INTEGER({ length : 5 }),
      allowNull: false
    },
    top_pict_link: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    email: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(64),
      allowNull: false
    }
  });

  return Stores;
};