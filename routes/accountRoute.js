// Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const errorController = require("../controllers/errorController");
const utilities = require("../utilities");
const regValidate  = require("../utilities/account-validation")

// Route to account management view
router.get("/login", utilities.handleErrors(accountController.buildLoginView));

router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegisterView)
);

// Regigistration route
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

module.exports = router;
