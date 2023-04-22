
const dishes = require("../controllers/dish.controller.js");
const order = require("../controllers/order.controller.js");

var router = require("express").Router();

// //get the valid dishes form a store
router.get('/dish', dishes.findValidDishesFromStore);

// //add the order of a dish
router.post('/order',order.createOrder);
 


module.exports = router;