const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    // ❗ If no results, return 404 page
    if (!data || data.length === 0) {
      let nav = await utilities.getNav();
      return res.status(404).render("errors/404", {
        title: "404",
        message: "The page you requested could not be found.",
        nav,
      });
    }

    const grid = await utilities.buildClassificationGrid(data);
    let nav = await utilities.getNav();
    const className = data[0].classification_name;

    return res.render("./inventory/classification", {
      title: `${className} vehicles`,
      nav,
      grid,
    });
  } catch (err) {
    next(err); // → triggers your 500 error page
  }
};

/* ***************************
 *  Build inventory detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
  try {
    const invId = req.params.inv_id;
    const data = await invModel.getInventoryByInvId(invId);

    // ❗ Same fix for invalid inventory item
    if (!data || data.length === 0) {
      let nav = await utilities.getNav();
      return res.status(404).render("errors/404", {
        title: "404",
        message: "The page you requested could not be found.",
        nav,
      });
    }

    const vehicle = data[0];
    const div = await utilities.buildByInventoryId(vehicle);
    let nav = await utilities.getNav();

    return res.render("./inventory/inv_detail", {
      title: `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      div,
    });
  } catch (err) {
    next(err); // triggers 500 page
  }
};

module.exports = invCont;
