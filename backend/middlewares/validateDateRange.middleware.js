const validateDateRange = (req, res, next) => {
  const { from, to } = req.query;

  // Helper to check if a string is a valid date
  const isValidDate = (dateStr) => !isNaN(Date.parse(dateStr));

  if (from && !isValidDate(from)) {
    return res.status(400).json({
      status: "fail",
      message: "The 'from' date is invalid. Please use YYYY-MM-DD format.",
    });
  }

  if (to && !isValidDate(to)) {
    return res.status(400).json({
      status: "fail",
      message: "The 'to' date is invalid. Please use YYYY-MM-DD format.",
    });
  }

  next(); // Everything looks good, move to the controller!
};

export default validateDateRange;
