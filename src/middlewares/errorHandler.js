// not found

const notFound = (req, res, next) => {
  const err = new Error(`Not Found : ${req.originalUrl}`);
  res.satus(404);
  next(err);
};

const errorHandlers = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { errorHandlers, notFound };
