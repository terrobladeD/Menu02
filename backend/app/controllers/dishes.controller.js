const { sequelize } = require('../models'); // Import the sequelize instance
const db = require("../models");
const Dishes = db.dishes;
const Customises = db.customises
const Dishtypes = db.dishtypes

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

// Get all dishes for a specific store
exports.getAllDishesFromStore = (req, res) => {
    const storeId = req.query.store_id;

    Dishes.findAll({
        where: {
            storeId: storeId
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
                message: err.message || "Some error occurred while retrieving all dishes."
            });
        });
};

// Get a specific dish from a store
exports.getSpecificDishFromStore = (req, res) => {
    const id = req.params.id;
    const storeId = req.query.store_id;

    Dishes.findOne({
        where: {
            id: id,
            storeId: storeId
        },
        include: [
            {
                model: Customises,
                as: 'customises'
            }
        ]
    })
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Dish with id=${id} and store_id=${storeId}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Dish with id=" + id
            });
        });
};

// Update the in_stock state of a Dish with id
exports.updateInStockState = (req, res) => {
    const id = req.params.id;
    const storeId = req.query.store_id;

    Dishes.findOne({
        where: {
            id: id,
            storeId: storeId, // Add this line to check the store ID
        },
    })
        .then(dish => {
            if (!dish) {
                return res.status(404).send({
                    message: `Cannot find Dish with id=${id}.`
                });
            }
            dish.is_instock = !dish.is_instock;
            dish.save()
                .then(() => {
                    res.send({
                        message: "Dish in_stock state was updated successfully."
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating Dish in_stock state with id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Dish with id=" + id
            });
        });
};

// Update the valid state of a Dish with id
exports.updateValidState = (req, res) => {
    const id = req.params.id;
    const storeId = req.query.store_id;

    Dishes.findOne({
        where: {
            id: id,
            storeId: storeId, // Add this line to check the store ID
        },
    })
        .then(dish => {
            if (!dish) {
                return res.status(404).send({
                    message: `Cannot find Dish with id=${id}.`
                });
            }
            dish.is_valid = !dish.is_valid;
            dish.save()
                .then(() => {
                    res.send({
                        message: "Dish valid state was updated successfully."
                    });
                })
                .catch(err => {
                    res.status(500).send({
                        message: "Error updating Dish valid state with id=" + id
                    });
                });
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Dish with id=" + id
            });
        });
};

// Update a dish's info with an id
exports.editDishInfo = async (req, res) => {
    const id = req.params.id;
    const storeId = req.query.store_id;
    const updateData = {};

    if (req.body.name) updateData.name = req.body.name;
    if (req.body.short_name) updateData.short_name = req.body.short_name;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.full_description) updateData.full_description = req.body.description;
    if (req.body.price_ori) updateData.price_ori = req.body.price_ori;
    if (req.body.price_cur) updateData.price_cur = req.body.price_cur;
    if (req.body.tags) updateData.tags = req.body.tags;
    if (req.body.pict_url) {
        // Validate the pict_url format
        const urlRegex = /^http:\/\/localhost:8080\/images\/[-\w+\/]+\.(png|jpg|jpeg|gif)$/i;
        if (urlRegex.test(req.body.pict_url)) {
            updateData.pict_url = req.body.pict_url;
        } else {
            return res.status(400).send({
                message: `Invalid pict_url format. The provided URL does not match the expected format.`,
            });
        }
    }
    if (req.body.dishtypeId) {
        const dishtypeExists = await Dishtypes.findOne({
            where: {
                id: req.body.dishtypeId,
                storeId: storeId, // Add storeId condition
            },
        });

        if (dishtypeExists) {
            updateData.dishtypeId = req.body.dishtypeId;
        } else {
            return res.status(500).send({
                message: `Invalid dishtypeId. The provided dishtypeId does not exist or does not belong to the store.`,
            });
        }
    }

    if (Object.keys(updateData).length === 0 && !req.body.customises) {
        return res.send({
            message: `Request body is empty. No updates were made for dish with id=${id}.`,
        });
    }

    try {
        await sequelize.transaction(async (t) => {
            if (Object.keys(updateData).length > 0) {
                const num = await Dishes.update(updateData, {
                    where: { id: id, storeId: storeId, },
                    transaction: t,
                });

                if (num != 1) {
                    return res.send({
                        message: `Cannot update dish with id=${id}. Maybe dish was not found or request body is empty.`,
                    });
                }
            }

            if (req.body.customises) {
                // Delete existing customises for the dish
                await Customises.destroy({
                    where: { dishId: id },
                    transaction: t,
                });

                // Add new customises
                const newCustomises = req.body.customises.map((customise) => ({
                    ...customise,
                    dishId: id,
                }));

                await Customises.bulkCreate(newCustomises, { transaction: t });
            }
        });

        res.send({
            message: "Dish was updated successfully.",
        });
    } catch (err) {
        res.status(500).send({
            message: "Error updating dish with id=" + id,
        });
    }
};


// Add a new dish to the database
exports.addDish = async (req, res) => {
    const storeId = req.query.store_id;

    // Validate request
    if (!req.body.name || !req.body.short_name || !req.body.pict_url) {
        return res.status(400).send({
            message: "Required fields are missing: name, short_name,and pict_url are required.",
        });
    }

    // Validate pict_url format
    const urlRegex = /^http:\/\/localhost:8080\/images\/[-\w+\/]+\.(png|jpg|jpeg|gif)$/i;
    if (!urlRegex.test(req.body.pict_url)) {
        return res.status(400).send({
            message: `Invalid pict_url format. The provided URL does not match the expected format.`,
        });
    }

    // Create a new dish object
    const newDish = {
        name: req.body.name,
        short_name: req.body.short_name,
        description: req.body.description,
        full_description: req.body.full_description,
        price_ori: req.body.price_ori,
        price_cur: req.body.price_cur,
        is_instock: req.body.is_instock || 1,
        is_valid: req.body.is_valid || 1,
        pict_url: req.body.pict_url,
        tags: req.body.tags || 0,
        storeId: storeId,
    };

    // Validate dishtypeId
    if (req.body.dishtypeId) {
        const dishtypeExists = await Dishtypes.findOne({
            where: {
                id: req.body.dishtypeId,
                storeId: storeId, // Add storeId condition
            },
        });

        if (dishtypeExists) {
            newDish.dishtypeId = req.body.dishtypeId;
        } else {
            return res.status(500).send({
                message: `Invalid dishtypeId. The provided dishtypeId does not exist or does not belong to the store.`,
            });
        }
    }

    try {
        await sequelize.transaction(async (t) => {
            // Save the new dish to the database
            const dish = await Dishes.create(newDish, { transaction: t });

            if (req.body.customises) {
                const newCustomises = req.body.customises.map((customise) => ({
                    ...customise,
                    dishId: dish.id,
                }));

                await Customises.bulkCreate(newCustomises, { transaction: t });
            }

            res.send(dish);
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "An error occurred while creating the dish.",
        });
    }
};


// Delete a dish from the database
exports.deleteDish = async (req, res) => {
    const id = req.params.id;
    const storeId = req.query.store_id;

    if (!id) {
        return res.status(400).send({
            message: "Id parameter is missing in the request."
        });
    }

    try {
        await sequelize.transaction(async (t) => {
            // Delete existing customises for the dish
            await Customises.destroy({
                where: { dishId: id },
                transaction: t,
            });

            // Delete the dish from the database
            const num = await Dishes.destroy({
                where: { id: id, storeId: storeId },
                transaction: t,
            });

            if (num === 1) {
                res.send({
                    message: "Dish was deleted successfully."
                });
            } else {
                res.status(404).send({
                    message: `Cannot delete dish with id=${id}. Dish was not found or has already been deleted.`
                });
            }
        });
    } catch (err) {
        res.status(500).send({
            message: err.message || "An error occurred while deleting the dish."
        });
    }
};
