export default (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
/*Promise.resolve() wraps whatever fn returns in a Promise:

If fn returns a Promise → uses it directly

If fn returns a value → creates an immediately resolved Promise

If fn returns undefined → creates an immediately resolved Promise (no error!)

.catch(next) safely forwards any errors to Express error handling */