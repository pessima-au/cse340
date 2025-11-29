const { body, validationResult } = require("express-validator");
const utilities = require("./");

/* *************************************
 * Classification Validation Rules
 ************************************* */
const classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .isAlpha()
      .withMessage(
        "Classification name must contain only letters, no spaces or special characters."
      )
      .isLength({ min: 1 })
      .withMessage("Classification name is required."),
  ];
};

/* *************************************
 * Check Validation Result Middleware
 ************************************* */
const checkClassificationData = async (req, res, next) => {
  const errors = validationResult(req);
  const nav = await utilities.getNav();

  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct the highlighted errors.");

    return res.status(400).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: errors.array(),
    });
  }

  next();
};

module.exports = {
  classificationRules,
  checkClassificationData,
};
