
const dishes = require("../controllers/dishes.controller.js");
const orders = require("../controllers/orders.controller.js");
const dishtypes = require("../controllers/dishtypes.controller.js");


var router = require("express").Router();

//get the valid dishes form a store
router.get('/dish', dishes.findValidDishesFromStore);

//add the order of a store
router.post('/order',orders.createOrder);

//get all dishtypes form a store
router.get('/dishtype',dishtypes.getAllDishTypes);
 


module.exports = router;