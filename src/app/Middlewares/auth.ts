import { UserRole } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import config from "../config";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import prisma from "../utils/prisma";
import { verifyToken } from "../utils/verifyToken";

const auth = (...roles: UserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Your are not authorized");
    }

    const decoded = verifyToken(
      token,
      config.access_secret as string
    ) as JwtPayload;

    req.user = decoded;

    const user = await prisma.user.findUnique({
      where: {
        email: decoded.email,
      },
    });

    if (!user) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
    }

    if (user.isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, "You are deleted user");
    }

    if (user?.status === "BLOCKED") {
      throw new AppError(httpStatus.CONFLICT, "You are a blocked user");
    }

    if (roles.length && !roles.includes(decoded.role)) {
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden access");
    }

    next();
  });
};

export default auth;
