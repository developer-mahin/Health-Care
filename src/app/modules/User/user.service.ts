import { UserRole } from "@prisma/client";
import { Request } from "express";
import { fileUpload } from "../../Middlewares/fileUpload";
import { hashedPassword } from "../../utils/hashedPassword";
import prisma from "../../utils/prisma";

const createAdminIntoDB = async (req: Request) => {
  const file = req.file;

  if (file) {
    const uploadedProfileImage = await fileUpload.uploadIntoCloudinary(file);
    req.body.admin.profilePhoto = uploadedProfileImage?.secure_url;
  }

  const hashPassword = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN,
      },
    });
    const newAdmin = await transactionClient.admin.create({
      data: req.body.admin,
    });

    return newAdmin;
  });

  return result;
};

const createDoctorIntoDB = async (req: Request) => {
  const file = req.file;
  if (file) {
    const uploadedImage = await fileUpload.uploadIntoCloudinary(req.file);
    req.body.doctor.profilePhoto = uploadedImage?.secure_url;
  }

  const passwordHashed = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        email: req.body.doctor.email,
        password: passwordHashed,
        role: UserRole.DOCTORS,
      },
    });

    const newDoctor = await transactionClient.doctor.create({
      data: req.body.doctor,
    });

    return newDoctor;
  });

  return result;
};

export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
};
