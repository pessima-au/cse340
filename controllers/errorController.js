exports.triggerError = function (req, res, next) {
  // cause a 500 — pass to error middleware
  next(new Error("Intentional server error for Task 3"));
};