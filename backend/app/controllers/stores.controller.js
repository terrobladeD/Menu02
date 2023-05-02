const { Op } = require('sequelize');
const db = require("../models");
const Stores = db.stores;


exports.getStoreInfo = async (req, res) => {
    try {
        const storeId = req.query.store_id;

        if (!storeId) {
            res.status(400).send({ message: "Missing storeId in the query parameters." });
            return;
        }

        const store = await Stores.findByPk(storeId, {
            attributes: ['name', 'description', 'top_pict_link']
        });

        if (!store) {
            res.status(404).send({ message: "Store not found with id: " + storeId });
            return;
        }

        res.status(200).send(store);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while fetching the store information."
        });
    }
};