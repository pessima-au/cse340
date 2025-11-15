module.exports = function (err, req, res, next) {
  console.error(err.stack);
  res.status(err.status || 500).render("errors/error", {
    title: "Server Error",
    message: err.message || "An unexpected error occurred.",
    error: process.env.NODE_ENV === "development" ? err : {},
    nav: res.locals.nav || "",
  });
};
