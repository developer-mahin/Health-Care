import {
  Admin,
  Doctor,
  Patient,
  Prisma,
  UserRole,
  UserStatus,
} from "@prisma/client";
import { Request } from "express";
import { fileUpload } from "../../Middlewares/fileUpload";
import { TAuthUser } from "../../interface";
import { IFile } from "../../interface/file";
import { TPagination } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePaginate";
import { hashedPassword } from "../../utils/hashedPassword";
import prisma from "../../utils/prisma";
import { userSearchAbleFields } from "./user.constant";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAdminIntoDB = async (req: Request): Promise<Admin> => {
  const file = req.file as IFile;

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

const createDoctorIntoDB = async (req: Request): Promise<Doctor> => {
  const file = req.file as IFile;
  if (file) {
    const uploadedImage = await fileUpload.uploadIntoCloudinary(file);
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

const createPatientIntoDB = async (req: Request): Promise<Patient> => {
  const file = req.file as IFile;
  if (file) {
    const uploadedImage = await fileUpload.uploadIntoCloudinary(file);
    req.body.patient.profilePhoto = uploadedImage?.secure_url;
  }

  const passwordHashed = await hashedPassword(req.body.password);
  const result = await prisma.$transaction(async (transactionClient) => {
    await transactionClient.user.create({
      data: {
        email: req.body.patient.email,
        password: passwordHashed,
        role: UserRole.PATIENT,
      },
    });

    const newPatient = await transactionClient.patient.create({
      data: req.body.patient,
    });

    return newPatient;
  });

  return result;
};

const getAllFromDB = async (params: any, options: TPagination) => {
  const { page, limit, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andCondions: Prisma.UserWhereInput[] = [];

  if (params.searchTerm) {
    andCondions.push({
      OR: userSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andCondions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditons: Prisma.UserWhereInput =
    andCondions.length > 0 ? { AND: andCondions } : {};

  const result = await prisma.user.findMany({
    where: whereConditons,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createAt: "desc",
          },

    select: {
      id: true,
      email: true,
      role: true,
      needPasswordChange: true,
      status: true,
      createAt: true,
      updatedAt: true,
      admin: true,
      patient: true,
      doctor: true,
    },
  });

  const total = await prisma.user.count({
    where: whereConditons,
  });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const getMyProfileFromDB = async (user: TAuthUser) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
    select: {
      id: true,
      email: true,
      needPasswordChange: true,
      role: true,
      status: true,
    },
  });

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.DOCTORS) {
    profileInfo = await prisma.doctor.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.findUnique({
      where: {
        email: userInfo.email,
      },
    });
  }

  return { ...userInfo, ...profileInfo };
};

const updateMyProfileIntoDB = async (user: TAuthUser, req: Request) => {
  const userInfo = await prisma.user.findUniqueOrThrow({
    where: {
      email: user?.email,
      status: UserStatus.ACTIVE,
    },
  });

  const file = req.file as IFile;
  if (file) {
    const uploadToCloudinary = await fileUpload.uploadIntoCloudinary(file);
    req.body.profilePhoto = uploadToCloudinary?.secure_url;
  }

  let profileInfo;

  if (userInfo.role === UserRole.SUPER_ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.ADMIN) {
    profileInfo = await prisma.admin.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.DOCTORS) {
    profileInfo = await prisma.doctor.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  } else if (userInfo.role === UserRole.PATIENT) {
    profileInfo = await prisma.patient.update({
      where: {
        email: userInfo.email,
      },
      data: req.body,
    });
  }

  return { ...profileInfo };
};

export const userServices = {
  createAdminIntoDB,
  createDoctorIntoDB,
  createPatientIntoDB,
  getAllFromDB,
  updateMyProfileIntoDB,
  getMyProfileFromDB,
};
