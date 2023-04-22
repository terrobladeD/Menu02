const db = require("../models");
const Dishes = db.dishes;
const Customises = db.customises

// find valid dishes for a specific store
exports.findValidDishesFromStore = (req, res) => {
    const storeId = req.query.store_id;

    Dishes.findAll({
        where: {
            storeId: storeId,
            is_valid: true
        },
        include: [
            {
                model: Customises,
                as: 'customises'
            }
        ]
    })
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving valid dishes."
            });
        });
};