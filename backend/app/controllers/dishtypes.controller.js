const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const db = require("../models");
const DishTypes = db.dishtypes
const Dishes = db.dishes;


exports.getAllDishTypes = async (req, res) => {
    try {
        const storeId = req.query.store_id;

        const dishTypes = await DishTypes.findAll({ where: { storeId: storeId } });

        res.status(200).send(dishTypes);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while fetching dish types."
        });
    }
};

exports.addDishType = async (req, res) => {
    try {
        const storeId = req.query.store_id;
        const type = req.body.type;
        const type_seq = parseInt(req.body.type_seq);

        // Increment type_seq for existing dishtypes
        await DishTypes.update(
            { type_seq: Sequelize.literal('type_seq + 1') },
            {
                where: {
                    storeId: storeId,
                    type_seq: {
                        [Op.gte]: type_seq
                    }
                }
            }
        );

        // Create new dish type
        const newDishType = await DishTypes.create({
            type: type,
            type_seq: type_seq,
            storeId: storeId
        });

        res.status(200).send(newDishType);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while adding the dish type."
        });
    }
};

exports.updateDishType = async (req, res) => {
    try {
        const storeId = req.query.store_id;
        const id = req.params.id;
        const type = req.body.type;
        const newTypeSeq = req.body.type_seq;

        const dishType = await DishTypes.findByPk(id);

        if (!dishType) {
            res.status(404).send({ message: "Dish type not found with id: " + id });
            return;
        }

        if (dishType.storeId !== storeId) {
            res.status(400).send({ message: "The dish type does not belong to the specified store." });
            return;
        }

        const oldTypeSeq = dishType.type_seq;
        let updatedDishType;

        console.log(oldTypeSeq,newTypeSeq,'!!!');
        if (oldTypeSeq !== newTypeSeq) {
            await DishTypes.sequelize.transaction(async (t) => {
                if (newTypeSeq > oldTypeSeq) {
                    await DishTypes.update(
                        { type_seq: Sequelize.literal('type_seq - 1') },
                        {
                            where: {
                                type_seq: { [Op.between]: [oldTypeSeq + 1, newTypeSeq] },
                                storeId: storeId,
                            },
                            transaction: t,
                        }
                    );
                } else {
                    await DishTypes.update(
                        { type_seq: Sequelize.literal('type_seq + 1') },
                        {
                            where: {
                                type_seq: { [Op.between]: [newTypeSeq, oldTypeSeq - 1] },
                                storeId: storeId,
                            },
                            transaction: t,
                        }
                    );
                }

                updatedDishType = await dishType.update({ type: type, type_seq: newTypeSeq }, { transaction: t });
            });
        } else {
            updatedDishType = await dishType.update({ type: type });
        }

        res.status(200).send(updatedDishType);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while updating the dish type."
        });
    }
};

exports.deleteDishType = async (req, res) => {
    try {
        const id = req.params.id;
        const storeId = req.query.store_id;

        const dishType = await DishTypes.findByPk(id);

        if (!dishType) {
            res.status(404).send({ message: "Dish type not found with id: " + id });
            return;
        }

        if (dishType.storeId !== storeId) {
            res.status(400).send({ message: "The dish type does not belong to the specified store." });
            return;
        }

        // Check if any dish is using this dish type
        const dishCount = await Dishes.count({ where: { dishtypeId: id } });

        if (dishCount > 0) {
            res.status(400).send({ message: "There are dishes using this dish type. Please remove them first." });
            return;
        }

        const type_seq = dishType.type_seq;

        await dishType.destroy();

        // Decrement type_seq for existing dishtypes
        await DishTypes.update(
            { type_seq: Sequelize.literal('type_seq - 1') },
            {
                where: {
                    storeId: storeId,
                    type_seq: {
                        [Op.gt]: type_seq
                    }
                }
            }
        );

        res.status(200).send({ message: "Dish type deleted successfully." });
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while deleting the dish type."
        });
    }
};

