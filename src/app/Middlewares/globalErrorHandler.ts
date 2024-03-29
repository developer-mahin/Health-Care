import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import httpStatus from "http-status";

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Something went wrong!!!",
    error: error,
  });
};

export default globalErrorHandler;
