import { UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../../utils/prisma";

const createAdminIntoDB = async (data: any) => {
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
