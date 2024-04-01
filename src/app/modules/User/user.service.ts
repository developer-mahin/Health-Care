import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { fileUpload } from "../../Middlewares/fileUpload";

const createAdminIntoDB = async (file: any, data: any) => {
  const isExist = await prisma.user.findFirst({
    where: {
      email: data.admin.email,
    },
  });

  if (isExist) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "Already an user has in this email"
    );
  }

  const uploadedImage = await fileUpload.uploadIntoCloudinary(file);
  const hashedPassword = await bcrypt.hash(data.password, 12);

  const userData = {
    email: data.admin.email,
    password: hashedPassword,
    role: UserRole.ADMIN,
  };

  const adminData = {
    ...data.admin,
    profilePhoto: uploadedImage?.secure_url,
  };

  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: userData,
    });

    const createdAdmin = await transactionClient.admin.create({
      data: adminData,
    });

    return createdAdmin;
  });

  return result;
};

export const userServices = {
  createAdminIntoDB,
};
