import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAdminIntoDB = async (data: any) => {
  const isExist = await prisma.user.findFirst({
    where: {
      email: data.email,
    },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Already an user has in this email"
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdmin = await transactionClient.admin.create({
      data: data.admin,
    });

    return createdAdmin;
  });

  return result;
};

export const userServices = {
  createAdminIntoDB,
};
