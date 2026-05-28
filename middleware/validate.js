const { listingschema, reviewSchema } = require("../schema.js");
const errors = require("../utils/express_err.js");

const validateListing = (req, res, next) => {
  const { error: listingValidation } = listingschema.validate(req.body);
  if (listingValidation) {
    throw new errors(
      400,
      "Invalid listing data",
      listingValidation.details.map((detail) => detail.message)
    );
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error: reviewValidation } = reviewSchema.validate(req.body);
  if (reviewValidation) {
    throw new errors(
      400,
      "Invalid review data",
      reviewValidation.details.map((detail) => detail.message)
    );
  }
  next();
};

module.exports = { validateListing, validateReview };
