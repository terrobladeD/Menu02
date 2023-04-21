const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,

    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle,
    },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.orders = require("./orders.model.js")(sequelize, Sequelize);
db.dishes = require("./dishes.model.js")(sequelize, Sequelize);
db.details = require("./details.model.js")(sequelize, Sequelize);
db.dishtypes = require("./dishtypes.model.js")(sequelize, Sequelize);
db.customises = require("./customises.model.js")(sequelize, Sequelize);
db.stores = require("./stores.model.js")(sequelize, Sequelize);

db.orders.belongsTo(db.stores, {
    foreignKey: {
        name: "storeId",
        allowNull: false
    }
});

db.dishes.belongsTo(db.stores, {
    foreignKey: {
        name: "storeId",
        allowNull: false
    }
});

db.dishtypes.belongsTo(db.stores, {
    foreignKey: {
        name: "storeId",
        allowNull: false
    }
});


db.orders.hasMany(db.details, { as: "details" });
db.details.belongsTo(db.orders, {
    foreignKey: "orderId",
    as: "orders",
});

db.dishes.hasMany(db.details, { as: "details" });
db.details.belongsTo(db.dishes, {
    foreignKey: "dishId",
    as: "dishes",
});

db.dishtypes.hasMany(db.dishes, { as: "dishes" });
db.dishes.belongsTo(db.dishtypes, {
    foreignKey: "dishtypeId",
    as: "dishtypes",
});

db.dishes.hasMany(db.customises, { as: "customises" });
db.customises.belongsTo(db.dishes, {
    foreignKey: "dishId",
    as: "dishes",
});


module.exports = db;