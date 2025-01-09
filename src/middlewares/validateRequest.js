export const validateRequest = (schema, source = 'body') => (req, res, next) => {
  const { error } = schema.validate(req[source], { abortEarly: false });
  if (error) {
    error.isJoi = true;
    return next(error);
  }
  next();
};
