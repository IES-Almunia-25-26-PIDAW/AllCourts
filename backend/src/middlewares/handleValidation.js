const { validationResult } = require('express-validator');

function handleValidation(req, res, next) {
  const result = validationResult(req);

  if (result.isEmpty()) {
    return next();
  }

  return res.status(422).json({
    errors: result.array().map((err) => ({
      field: err.path,
      message: err.msg,
    })),
  });
}

module.exports = handleValidation;