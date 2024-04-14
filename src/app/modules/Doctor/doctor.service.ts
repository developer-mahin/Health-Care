import { Doctor, Prisma, UserStatus } from "@prisma/client";
import { TGenericResponse } from "../../interface/common";
import calculatePagination from "../../utils/calculatePaginate";
import prisma from "../../utils/prisma";
import { doctorSearchableFields } from "./doctor.constant";
import { TDoctorFilterRequest, TDoctorUpdate } from "./doctor.interface";
import httpStatus from "http-status";
import AppError from "../../errors/AppError";

const getAllFromDB = async (
  filters: TDoctorFilterRequest,
  options: any
): Promise<TGenericResponse<Doctor[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, specialties, ...filterData } = filters;

  const andConditions: Prisma.DoctorWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: doctorSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (specialties && specialties.length > 0) {
    andConditions.push({
      doctorSpecialties: {
        some: {
          specialties: {
            title: {
              contains: specialties,
              mode: "insensitive",
            },
          },
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    const filterConditions = Object.keys(filterData).map((key) => ({
      [key]: {
        equals: (filterData as any)[key],
      },
    }));
    andConditions.push(...filterConditions);
  }

  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.DoctorWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctor.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : { createdAt: "desc" },
    include: {
      doctorSpecialties: {
        include: {
          specialties: true,
        },
      },
    },
  });

  const total = await prisma.doctor.count({
    where: whereConditions,
  });

  return {
    meta: {
      total,
      page,
      limit,
    },
    data: result,
  };
};

const getByIdFromDB = async (id: string): Promise<Doctor | null> => {
  const result = await prisma.doctor.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      doctorSpecialties: true,
    },
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "Doctor Not found with this ID!!");
  }

  return result;
};

const updateIntoDB = async (id: string, payload: Partial<TDoctorUpdate>) => {
  const { specialties, ...doctorData } = payload;

  const user = await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.doctor.update({
      where: {
        id,
      },
      data: doctorData,
      include: {
        doctorSpecialties: true,
      },
    });

    if (specialties && specialties?.length > 0) {
      const deletedSpecialtyId = specialties.filter(
        (specialty) => specialty.isDeleted
      );

      for (const id of deletedSpecialtyId) {
        await transactionClient.doctorSpecialties.deleteMany({
          where: {
            doctorId: user.id,
            specialitiesId: id.specialitiesId,
          },
        });
      }

      const createSpecialtyId = specialties.filter(
        (specialty) => !specialty.isDeleted
      );
      for (const id of createSpecialtyId) {
        await transactionClient.doctorSpecialties.create({
          data: {
            specialitiesId: id.specialitiesId,
            doctorId: user.id,
          },
        });
      }
    }
  });

  const result = await prisma.doctor.findUnique({
    where: {
      id: user.id,
    },
    include: {
      doctorSpecialties: true,
    },
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: deleteDoctor.email,
      },
    });

    return deleteDoctor;
  });
};

const softDelete = async (id: string): Promise<Doctor> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deleteDoctor = await transactionClient.doctor.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deleteDoctor.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deleteDoctor;
  });
};

export const DoctorService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
