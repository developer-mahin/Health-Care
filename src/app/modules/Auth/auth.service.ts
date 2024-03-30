import { UserStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { JwtPayload } from "jsonwebtoken";
import { default as Config, default as config } from "../../config";
import { generateJsonWebToken } from "../../utils/generateJsonWebToken";
import prisma from "../../utils/prisma";
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

export const AuthService = {
  loginUser,
  refreshToken,
};
