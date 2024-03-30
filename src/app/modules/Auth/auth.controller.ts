import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import Config from "../../config";

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
    message: "Logged in successful",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  refreshToken,
};
