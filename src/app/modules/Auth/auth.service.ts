import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import { JwtPayload } from "jsonwebtoken";
import { default as Config, default as config } from "../../config";
import AppError from "../../errors/AppError";
import { TAuthUser, TTokenDecodedUser } from "../../interface";
import { generateJsonWebToken } from "../../utils/generateJsonWebToken";
import prisma from "../../utils/prisma";
import sendMail from "../../utils/sendMail";
import { verifyToken } from "../../utils/verifyToken";

const loginUser = async (payload: { email: string; password: string }) => {
  const { email, password } = payload;

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email,
    },
  });

  const isMatchPassword = await bcrypt.compare(password, userData.password);
  if (!isMatchPassword) {
    throw new Error("Password or email not match please try again");
  }

  const userInfo = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const accessToken = generateJsonWebToken(
    userInfo,
    Config.access_secret as string,
    Config.access_expires_in as string
  );

  const refreshToken = generateJsonWebToken(
    userInfo,
    Config.refresh_secret as string,
    Config.refresh_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: userData.needPasswordChange,
  };
};

const refreshToken = async (token: string) => {
  let userData;
  try {
    userData = verifyToken(
      token,
      config.refresh_secret as string
    ) as JwtPayload;
  } catch (error) {
    throw new Error("Your are not authorized");
  }

  const isUserExist = await prisma.user.findUniqueOrThrow({
    where: {
      email: userData.email,
      status: UserStatus.ACTIVE,
    },
  });

  const userInfo = {
    id: isUserExist.id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const generateToken = generateJsonWebToken(
    userInfo,
    config.access_secret as string,
    config.access_expires_in as string
  );

  return {
    accessToken: generateToken,
    needPasswordChange: isUserExist.needPasswordChange,
  };
};

const changePassword = async (
  user: TAuthUser,
  payload: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const checkMatchedPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!checkMatchedPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Password not matched!! please try again"
    );
  }

  const hashPassword = await bcrypt.hash(payload.newPassword, 10);

  await prisma.user.update({
    where: {
      email: user?.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  const userInfo = {
    id: userData.id,
    email: userData.email,
    role: userData.role,
  };

  const token = generateJsonWebToken(
    userInfo,
    config.reset_pass_secret as string,
    config.reset_pass_expires_in as string
  );

  const resetPasswordLink =
    config.front_end_url + `?email=${userData.email}&token=${token}`;

  const html = `
    <div>
      <div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi,
          praesentium!
        </p>
      </div>
      <a href=${resetPasswordLink}>
        <button
          style="
            padding: 10px;
            border-radius: 7px;
            background-color: #0062ff;
            color: white;
            font-weight: 500;
            border: none;
          "
        >
          Reset Password
        </button>
      </a>
    </div>
    `;

  await sendMail(userData.email, html);
  return resetPasswordLink;
};

const resetPassword = async (
  token: string,
  payload: { email: string; password: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isVerifyToken = verifyToken(token, config.reset_pass_secret as string);
  if (!isVerifyToken) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "Your are not authorized, Forbidden access"
    );
  }

  const hashPassword = await bcrypt.hash(payload.password, 10);

  await prisma.user.update({
    where: {
      email: payload.email,
    },
    data: {
      password: hashPassword,
      needPasswordChange: false,
    },
  });
};

export const AuthService = {
  loginUser,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
