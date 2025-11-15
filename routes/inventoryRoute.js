// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const errorController = require("../controllers/errorController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory detail view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// Route to trigger an error for testing error handling
router.get("/cause-error", errorController.triggerError);

module.exports = router;
