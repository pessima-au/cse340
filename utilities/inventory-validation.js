const { body, validationResult } = require("express-validator");
const utilities = require("./");

const inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please choose a classification."),

    body("inv_make")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle make."),

    body("inv_model")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a vehicle model."),

    body("inv_year")
      .isInt({ min: 1900, max: 2099 })
      .withMessage("Enter a valid year."),

    body("inv_description")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide an image path."),

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a thumbnail path."),

    body("inv_price").isNumeric().withMessage("Enter a valid price."),

    body("inv_miles").isNumeric().withMessage("Enter valid miles."),

    body("inv_color").trim().isAlpha().withMessage("Color must be alphabetic."),
  ];
};

const checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(
    req.body.classification_id
  );

  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the errors below.");

    return res.status(400).render("inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: errors.array(),
      ...req.body,
    });
  }

  next();
};

module.exports = { inventoryRules, checkInventoryData };
