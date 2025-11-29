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
const utilities = require("./utilities/");
const errorController = require("./controllers/errorController");
const session = require("express-session");
const pool = require("./database/");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");

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
 * Middleware
 * ************************/
app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: "sessionId",
  })
);

// Express message middleware
app.use(require("connect-flash")());
app.use(function (req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //for parsing application/x.www.form-urlencoded

/* ***********************
 * Routes
 *************************/
app.use(static);

// Index Routes
app.get("/", baseController.buildHome);
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);

// File Not Found Route - must be last route
app.use(errorController.handle404);
app.use((err, req, res, next) => {
  return errorController.get500(err, req, res, next);
});

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
