const { Op, or } = require('sequelize');
const sendOrderEmail = require('../others/orderEmailSender')
const db = require("../models");
const Dishes = db.dishes;
const Customises = db.customises
const Details = db.details;
const Orders = db.orders;
const Stores = db.stores

// Helper function to get start and end date
const getDateRange = (inputDate) => {
    const startDate = new Date(inputDate);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 1);
    return [startDate, endDate];
};

// Create and save new order
// process 0: validate inputs
// process 1: check the sum of quantity * current = total_price
// process max: check payment
// process 2: create and save Order&Detail in the database
// process 3: send email to customer
exports.createOrder = async (req, res) => {
    // 0.Validate inputs : data form and types and all dirved from a single store
    if (!req.body.total_price || !req.body.transaction_fee || !req.body.table_num || !req.body.details || req.body.details.length < 1) {
        res.status(404).send({
            message: "Order Form Contents Error!"
        });
        return;
    }

    if (typeof req.body.total_price !== "number" || typeof req.body.transaction_fee !== "number" || typeof req.body.table_num !== "string" || typeof req.body.email !== "string" || typeof req.body.additional_info !== "string") {
        res.status(404).send({
            message: "Order Form Datatypes Error!"
        });
        return;
    }

    req.body.details.forEach(({ quantity, dishId, customises, sub_price }) => {
        if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity <= 0) {
            res.status(404).send({
                message: "Quantity Error!"
            });
            return;
        }
        if (typeof dishId !== "number" || !Number.isInteger(dishId)) {
            res.status(404).send({
                message: "dishId Error!"
            });
            return;
        }
        if (!Array.isArray(customises)) {
            res.status(404).send({
                message: "customise Error!"
            });
            return;
        }
        if (typeof sub_price !== "number") {
            res.status(404).send({
                message: "Sub Price Error!"
            });
            return;
        }
    });

    try {
        // Fetch dishes with matching dishId
        const dishes = await Promise.all(req.body.details.map(({ dishId }) => Dishes.findByPk(dishId)));

        // Check if all dish ids exist
        if (dishes.some(dish => !dish)) {
            res.status(404).send({
                message: "One or more dish ids do not exist."
            });
            return;
        }

        // Check if all dishes have the same storeId as the query.store_id
        if (dishes.some(dish => dish.storeId !== req.query.store_id)) {
            res.status(404).send({
                message: "All dishes should belong to the same store."
            });
            return;
        }
    } catch (error) {
        // Handle any errors that occurred during the execution
        res.status(500).send({
            message: error.message || "An error occurred while processing the request."
        });
    }

    // 1.check all fees
    // 1.1 check transaction_fee
    const totalComediesPrice = req.body.details.reduce((acc, curr) => acc + curr.sub_price, 0);
    const CalculateTransactionFee = totalComediesPrice < 50 ? totalComediesPrice * 0.06 : totalComediesPrice * 0.03;
    if (CalculateTransactionFee !== req.body.transaction_fee) {
        res.status(404).send({
            message: "Transaction Fee Mismatch"
        });
        return;
    }

    const customiseIds = new Set(req.body.details.flatMap(({ customises }) => customises));
    //have to make a set to keep the customise unique as one customise may be shown multiple times

    // 1.2 check every sub_price
    try {
        await Promise.all([
            ...req.body.details.map(({ dishId }) => Dishes.findByPk(dishId)),
            ...Array.from(customiseIds).map(customiseId => Customises.findByPk(customiseId)),
        ])
            .then(results => {
                const dishes = results.slice(0, req.body.details.length);
                const customises = results.slice(req.body.details.length);
                // Validate sub_price and calculate the sum of all sub_prices
                let sumSubPrices = 0;
                req.body.details.forEach((detail, index) => {
                    const dish = dishes[index];
                    const dishCustomises = customises.filter(c => detail.customises.includes(c.id));
                    const sumCustomisesPrice = dishCustomises.reduce((acc, c) => acc + c.price, 0);
                    const expectedSubPrice = (dish.price_cur + sumCustomisesPrice) * detail.quantity;

                    if (detail.sub_price !== expectedSubPrice) {
                        res.status(400).send({
                            message: "Sub Price Mismatch Error!"
                        });
                        return;
                    }
                    sumSubPrices += detail.sub_price;
                });
                // 1.3 check total_price
                // Calculate transaction_fee and validate total_price
                const transactionFee = sumSubPrices < 50 ? 0.06 * sumSubPrices : 0.03 * sumSubPrices;
                const expectedTotalPrice = sumSubPrices + transactionFee;

                if (req.body.total_price !== expectedTotalPrice) {
                    res.status(400).send({
                        message: "Total Price Mismatch Error!"
                    });
                    return;
                }
            });
    } catch (error) {
        // Handle any errors that occurred during the execution
        res.status(500).send({
            message: error.message || "An error occurred while processing the request."
        });
    }

    // TO DO: check payment
    // TO DO: check payment
    // TO DO: check payment

    // 2. create and save Order in the database
    // create a Order
    const order = {
        total_price: req.body.total_price,
        table_num: req.body.table_num,
        date: Date.now(),
        email: req.body.email,
        status: 0,
        additional_info: req.body.additional_info ? req.body.additional_info : null,
        storeId: req.query.store_id
    };

    // Save Order in the database
    Orders.create(order)
        .then(orderData => {
            Promise.all(req.body.details.map(async ({ dishId, quantity, customises, sub_price }) => {
                const dish = await Dishes.findByPk(dishId);
                const customiseInstances = await Promise.all(customises.map(customiseId => Customises.findByPk(customiseId)));
                const customise_names = customiseInstances.map(customise => customise.name).join(',');

                let detail = {
                    quantity: quantity,
                    sub_price: sub_price,
                    customise_names: customise_names,
                    orderId: orderData.id,
                    dish_name: dish.name
                };

                return Details.create(detail)
                    .catch(err => {
                        res.status(404).send({
                            message:
                                "Some error occurred while creating the Detail."
                        });
                        return;
                    });
            })).then(() => {
                res.status(200).send({
                    orderId: orderData.id,
                    message: "Order successfully created"
                });
                // //send the message to the admin front end
                // websocket.broadcastMessage(JSON.stringify({ message: "New order received", orderId: orderData.id }));

            })

        })
        .catch(err => {
            res.status(404).send({
                message: "Some error occurred while creating the Order."
            });
            return;
        });

    //3. sent email to customer
    if (order.email) {
        const dishIds = req.body.details.map(detail => detail.dishId);
        const customisesIds = [].concat(...req.body.details.map(detail => detail.customises));
        const store = await Stores.findByPk(req.query.store_id);
        if (!store) {
            res.status(404).send({ message: "Store not found with id: " + req.query.store_id });
            return;
        }
        const storeName = store.name;

        const fetchDishes = Dishes.findAll({
            where: {
                id: {
                    [Op.in]: dishIds
                }
            }
        });

        const fetchCustomises = Customises.findAll({
            where: {
                id: {
                    [Op.in]: customisesIds
                }
            }
        });

        Promise.all([fetchDishes, fetchCustomises])
            .then(([dishes, customises]) => {
                const orderDetails = req.body.details.map(detail => {
                    const dish = dishes.find(d => d.id === detail.dishId);
                    const customisesNames = detail.customises.map(cId => {
                        const customise = customises.find(c => c.id === cId);
                        return customise ? customise.name : '';
                    });
                    return {
                        quantity: detail.quantity,
                        name: dish.name,
                        price: detail.sub_price,
                        customises: customisesNames
                    };
                });

                const orderInfo = {
                    storeName: storeName,
                    tableNum: req.body.table_num,
                    totalPrice: req.body.total_price,
                    transactionFee: req.body.transaction_fee,
                }
                const allDetails = {
                    ...orderInfo,
                    orderDetails: orderDetails
                }
                // console.log('~~~~', allDetails);
                sendOrderEmail(req.body.email, allDetails);
            })
            .catch(err => {
                console.error('Error fetching dish and customise details for email:', err);
            });
    }

};

// get all orders for a specific date for a store
exports.getOrdersByDate = async (req, res) => {
    try {
        const inputDate = req.params.date;
        const storeId = req.query.store_id;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        if (!storeId) {
            res.status(400).send({
                message: "Missing storeId in the query parameters."
            });
            return;
        }

        if (limit > 50) {
            limit = 50;
        }

        const [startDate, endDate] = getDateRange(inputDate);

        const orders = await Orders.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                storeId: storeId
            },
            include: [
                {
                    model: Details,
                    as: 'details',
                }
            ],
            limit: limit,
            offset: offset
        });

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while fetching the orders."
        });
    }
};

// Retrieve numbers of orders in a specific date
exports.getOrdersCountByDate = async (req, res) => {
    try {
        const inputDate = req.params.date;
        const storeId = req.query.store_id;
        const [startDate, endDate] = getDateRange(inputDate);

        if (!storeId) {
            res.status(400).send({
                message: "Missing storeId in the query parameters."
            });
            return;
        }

        const count = await Orders.count({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                },
                storeId: storeId
            }
        });


        res.status(200).send({ count: count });
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while counting the orders."
        });
    }
};
// Get a basic order summary for a store
exports.getBasicOrderSummary = async (req, res) => {
    try {
        const storeId = req.query.store_id;

        if (!storeId) {
            res.status(400).send({
                message: "Missing storeId in the query parameters."
            });
            return;
        }

        const orders = await Orders.findAll({ where: { storeId: storeId } });

        let summary = {
            total_orders: orders.length,
            total_revenue: 0
        };

        orders.forEach(order => {
            summary.total_revenue += order.total_price;
        });

        res.status(200).send(summary);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while fetching the order summary."
        });
    }
};
// Retrieve a single Order with id
exports.getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const storeId = req.query.store_id;

        if (!storeId) {
            res.status(400).send({
                message: "Missing storeId in the query parameters."
            });
            return;
        }

        const order = await Orders.findOne({
            where: {
                id: id,
                storeId: storeId
            }
        });

        if (!order) {
            res.status(404).send({ message: "Order not found with id: " + id });
            return;
        }

        res.status(200).send(order);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while fetching the order."
        });
    }
};
// Make an order finished
exports.updateOrderStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const storeId = req.query.store_id;

        if (!storeId) {
            res.status(400).send({
                message: "Missing storeId in the query parameters."
            });
            return;
        }

        const order = await Orders.findOne({
            where: {
                id: id,
                storeId: storeId
            }
        });

        if (!order) {
            res.status(404).send({ message: "Order not found with id: " + id });
            return;
        }

        const updatedOrder = await order.update({ status: 1 });

        res.status(200).send(updatedOrder);
    } catch (error) {
        res.status(500).send({
            message: error.message || "An error occurred while updating the order."
        });
    }
};