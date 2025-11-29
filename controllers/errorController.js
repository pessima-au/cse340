// 404 error handler
exports.handle404 = (req, res) => {
  res.status(404).render("errors/404", {
    title: "404:",
    message: "The page you are looking for does not exist.",
    nav: res.locals.nav,
  });
};

// 500 error handler
exports.get500 = (err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("errors/500", {
    title: "Server Error",
    message:
      "Server error. This is an intentional server error for testing purposes.",
    nav: res.locals.nav,
    error: process.env.NODE_ENV === "development" ? err : {},
  });
};

// A function that intentionally causes an error
exports.triggerError = (req, res, next) => {
  try {
    throw new Error("Intentional Server Error for Task 3");
  } catch (err) {
    next(err);
  }
};
