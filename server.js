/* ******************************************
 * This server.js file is the primary file of the
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const env = require("dotenv").config();
const app = express();
const static = require("./routes/static");
const baseController = require("./controllers/baseController");
const inventoryRoute = require("./routes/inventoryRoute");
const miscRouter = require("./routes/miscRoute");
const errorHandler = require("./middleware/errorHandler");
const utilities = require("./utilities/");

// populate nav for all views — must run before route handlers
app.use(async (req, res, next) => {
  try {
    res.locals.nav = await utilities.getNav();
  } catch (err) {
    console.error("nav middleware error:", err);
    res.locals.nav =
      '<ul class="navigation"><li><a href="/">Home</a></li></ul>';
  }
  next();
});

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index Routes
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use("/", miscRouter);

// 404 handler (must be before error handler)
app.use((req, res) => {
  res.status(404).render("errors/404", {
    title: "Page Not Found",
    nav: res.locals.nav || "",
    message: "Sorry — the requested page could not be found.",
  });
});

// global error handler (last middleware)
app.use(errorHandler);

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT;
const host = process.env.HOST;

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`);
});

// Log all routes
app._router.stack
  .filter((r) => r.route)
  .forEach((r) =>
    console.log(Object.keys(r.route.methods)[0].toUpperCase(), r.route.path)
  );
