import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import Config from "../../config";
import AppError from "../../errors/AppError";
import { Request, Response } from "express";
import { TAuthUser } from "../../interface";

const loginUser = catchAsync(async (req, res) => {
  const { accessToken, needPasswordChange, refreshToken } =
    await AuthService.loginUser(req.body);

  res.cookie("refreshToken", refreshToken, {
    secure: Config.NODE_ENV === "production",
    httpOnly: true,
  });

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Logged in successful",
    data: {
      accessToken,
      needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "access token generate successfully",
    data: result,
  });
});

const changePassword = catchAsync(
  async (req: Request & { user?: TAuthUser }, res: Response) => {
    const user = req.user;
    await AuthService.changePassword(user as TAuthUser, req.body);

    sendResponse(res, {
      status: httpStatus.OK,
      success: true,
      message: "Password change successfully",
    });
  }
);

const forgotPassword = catchAsync(async (req, res) => {
  const result = await AuthService.forgotPassword(req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Check your mail and update your password",
    data: result,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const token = req.headers.authorization;
  if (!token) {
    throw new AppError(httpStatus.BAD_REQUEST, "Your are not authorized");
  }

  await AuthService.resetPassword(token, req.body);

  sendResponse(res, {
    status: httpStatus.OK,
    success: true,
    message: "Check your mail and update your password",
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
