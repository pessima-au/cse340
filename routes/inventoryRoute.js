// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const errorController = require("../controllers/errorController");
const utilities = require("../utilities/index");
const invValidate = require("../utilities/classification-validation");
const validateInv = require("../utilities/inventory-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by inventory detail view
router.get("/detail/:inv_id", invController.buildByInventoryId);

// 500 error trigger route for testing
router.get("/cause-error", errorController.triggerError);

// Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Add Classification View
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Process add classification
router.post(
  "/add-classification",
  invValidate.classificationRules(),
  invValidate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Add Inventory View
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

// Process Add Inventory Form
router.post(
  "/add-inventory",
  validateInv.inventoryRules(),
  validateInv.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
