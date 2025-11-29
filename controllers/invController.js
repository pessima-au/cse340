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

/* ****************************************
 *  Deliver Inventory Management View
 **************************************** */
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav();

    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  } catch (err) {
    next(err);
  }
};


/* ****************************************
 * Deliver Add Classification View
 **************************************** */
invCont.buildAddClassification = async function (req, res, next) {
  const nav = await utilities.getNav();

  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 * Process New Classification
 **************************************** */
invCont.addClassification = async function (req, res) {
  const { classification_name } = req.body;
  const nav = await utilities.getNav();

  const result = await invModel.addClassification(classification_name);

  if (result) {
    // Success
    req.flash("notice", `${classification_name} classification added successfully.`);

    // Refresh navigation dynamically
    const nav = await utilities.getNav();

    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    });
  }

  // Fail
  req.flash("notice", "Failed to add classification.");

  res.status(500).render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  });
};

/* ****************************************
 * Deliver Add Inventory View
 **************************************** */
invCont.buildAddInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
  });
};

/* ****************************************
 * Process New Inventory
 **************************************** */
invCont.addInventory = async function (req, res, next) {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body;

  const result = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  );

  if (result) {
    req.flash("notice", `${inv_make} ${inv_model} added successfully.`);

    const nav = await utilities.getNav();
    return res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav,
    });
  }

  req.flash("notice", "Failed to add inventory item.");

  const nav = await utilities.getNav();
  const classificationList = await utilities.buildClassificationList(classification_id);

  return res.status(500).render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    ...req.body
  });
};



module.exports = invCont;
