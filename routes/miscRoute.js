const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

router.get("/cause-error", invController.triggerError);

module.exports = router;
