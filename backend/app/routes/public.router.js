
const dishes = require("../controllers/dishes.controller.js");
const orders = require("../controllers/orders.controller.js");
const dishtypes = require("../controllers/dishtypes.controller.js");
const stores = require("../controllers/stores.controller.js");


var router = require("express").Router();

//get the valid dishes form a store
router.get('/dish', dishes.findValidDishesFromStore);

//add the order of a store
router.post('/order',orders.createOrder);

//get all dishtypes form a store
router.get('/dishtype',dishtypes.getAllDishTypes);

//get the info of a store
router.get('/storeinfo',stores.getStoreInfo)
 


module.exports = router;