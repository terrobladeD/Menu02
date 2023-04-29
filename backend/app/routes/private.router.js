const dishes = require("../controllers/dishes.controller.js");
const orders = require("../controllers/orders.controller.js");
const dishtypes = require("../controllers/dishtypes.controller.js");
const router = require("express").Router();
const { authenticateJWT } = require('./JWT.router.js');

//get the all dishes form a store
router.get('/dish/all', authenticateJWT, dishes.getAllDishesFromStore);

//get a sepcific dish from a store
router.get('/dish/:id', authenticateJWT, dishes.getSpecificDishFromStore);

// Make a single dish sold out or in stock with id
router.put("/dish/instock/:id", authenticateJWT, dishes.updateInStockState);

// Make a single dish valid or invalid with id
router.put("/dish/valid/:id", authenticateJWT, dishes.updateValidState);

// // Edit a dish's all information by its id
router.put("/dish/edit/:id", authenticateJWT, dishes.editDishInfo);

// Add a dish
router.post("/dish/add", authenticateJWT, dishes.addDish);

// Delete a dish
router.delete("/dish/delete/:id", authenticateJWT, dishes.deleteDish);

// Retrieve all Orders in a specific date with page and limit
router.get("/order/bydate/:date", authenticateJWT, orders.getOrdersByDate);

// Retrieve numbers of order in a specific date
router.get("/order/bydate/total/:date", authenticateJWT, orders.getOrdersCountByDate);

// Get a basic order summary for a store
router.get("/order/summary", authenticateJWT, orders.getBasicOrderSummary);

// Retrieve a single Order with id
router.get("/order/:id", authenticateJWT, orders.getOrderById);

// Make a order finished
router.put("/order/status/:id", authenticateJWT, orders.updateOrderStatus);

//update a dishtype form a store
router.put('/dishtype/:id', authenticateJWT, dishtypes.updateDishType);

//add a dishtype form a store
router.post('/dishtype', authenticateJWT, dishtypes.addDishType);

//delete a dishtype form a store
router.delete('/dishtype/:id', authenticateJWT, dishtypes.deleteDishType);

module.exports = router;