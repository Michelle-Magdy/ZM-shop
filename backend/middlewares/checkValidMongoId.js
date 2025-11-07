import AppError from "../util/appError.js";

// Function to check if a string is a valid MongoDB ObjectId format
const checkValidMongoId = (id) => (req, res, next) => {
  // We are checking the ID passed in the URL parameters
  const itemID = req.params[id];

  // 1. Check if the ID exists
  if (!itemID) {
    return next(new Error("Product ID is missing in the request URL."));
  }

  // 2. Check the format: a 24-character hexadecimal string
  // The regular expression /^[0-9a-fA-F]{24}$/ tests for exactly 24 characters
  // that are 0-9 or a-f (case-insensitive).
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!mongoIdRegex.test(itemID)) {
    // If the format is invalid, send a custom error message
    // This provides a cleaner error than the Mongoose CastError
    return next(
      new AppError(
        `Invalid Product ID format: "${itemID}". ID must be a valid 24-character hexadecimal string.`
      )
    );
  }

  // 3. If the ID is valid, proceed to the next middleware (or controller)
  next();
};

export { checkValidMongoId };
