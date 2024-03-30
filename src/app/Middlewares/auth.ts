import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { verifyToken } from "../utils/verifyToken";
import config from "../config";
import { JwtPayload } from "jsonwebtoken";

const auth = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized");
    }

    const decoded = verifyToken(
      token,
      config.access_secret as string
    ) as JwtPayload;

    if (roles.length && !roles.includes(decoded.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
    }

    next();
  };
};

export default auth;
