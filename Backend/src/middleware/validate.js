export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  // console.log("result.success", result.success);
  if (!result.success) {
    return res.status(400).json({
      message: "Validation error",
      errors: result.error.flatten(),
    });
  }
  // overwrite with parsed values (trimmed/coerced)
  req.body = result.data.body;
  req.query = result.data.query;
  req.params = result.data.params;
  next();
};
