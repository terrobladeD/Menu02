
const dishes = require("../controllers/dishes.controller.js");
const orders = require("../controllers/orders.controller.js");

var router = require("express").Router();

// //get the valid dishes form a store
router.get('/dish', dishes.findValidDishesFromStore);

// //add the order of a dish
router.post('/order',orders.createOrder);
 


module.exports = router;