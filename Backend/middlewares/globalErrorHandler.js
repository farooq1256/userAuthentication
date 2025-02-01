import createHttpError from "http-errors";
import dotenv from "dotenv";
dotenv.config();
const globalErrorHandler = (err, req, res, next) => {
   
  const statusCode = err.statusCode || 5000;

  return res.status(statusCode).json({
    message: err.message,
    errorStack: process.env.NODE_ENV === "development" ? err.stack : "",
  });
};

export default globalErrorHandler;