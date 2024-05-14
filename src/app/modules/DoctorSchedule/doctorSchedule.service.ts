import { Prisma } from "@prisma/client";
import { TAuthUser } from "../../interface";
import { IAuthUser } from "../../interface/common";
import calculatePagination from "../../utils/calculatePaginate";
import prisma from "../../utils/prisma";
import { TPagination } from "../../types/pagination";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import { IDoctorScheduleFilterRequest } from "./doctorSchedule.interface";

const createDoctorScheduleIntoDB = async (
  user: TAuthUser | undefined,
  payload: {
    scheduleIds: string[];
  }
) => {
  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorScheduleData = payload.scheduleIds.map((id) => ({
    doctorId: doctorData.id,
    scheduleId: id,
    isBooked: false,
  }));

  const result = await prisma.doctorSchedules.createMany({
    data: doctorScheduleData,
  });

  return result;
};

const getDoctorScheduleFromDB = async (
  filters: any,
  options: TPagination,
  user: IAuthUser
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDateTime, endDateTime, ...filterData } = filters; // Extracting startDate and endDate from filters

  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }

    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        return {
          [key]: {
            equals: (filterData as any)[key],
          },
        };
      }),
    });
  }

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          schedule: {
            startDate: {
              gte: startDateTime,
            },
          },
        },
        {
          schedule: {
            endDate: {
              lte: endDateTime,
            },
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.DoctorSchedulesWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.doctorSchedules.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
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

const deleteDoctorScheduleFromDB = async (
  user: TAuthUser,
  scheduleId: string
) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  const scheduleData = await prisma.doctorSchedules.findUnique({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id!,
        scheduleId,
      },
      isBooked: true,
    },
  });

  if (scheduleData?.isBooked) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      "This Schedule Is Already Booked You Can Not Delete At any more"
    );
  }

  await prisma.doctorSchedules.delete({
    where: {
      doctorId_scheduleId: {
        doctorId: doctorData?.id!,
        scheduleId: scheduleId,
      },
    },
  });
};

const getAllFromDB = async (
  filters: IDoctorScheduleFilterRequest,
  options: TPagination
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      doctor: {
        name: {
          contains: searchTerm,
          mode: "insensitive",
        },
      },
    });
  }

  if (Object.keys(filterData).length > 0) {
    if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "true"
    ) {
      filterData.isBooked = true;
    } else if (
      typeof filterData.isBooked === "string" &&
      filterData.isBooked === "false"
    ) {
      filterData.isBooked = false;
    }
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: any =
    andConditions.length > 0 ? { AND: andConditions } : {};
  const result = await prisma.doctorSchedules.findMany({
    include: {
      doctor: true,
      schedule: true,
    },
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {},
  });
  const total = await prisma.doctorSchedules.count({
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

export const DoctorScheduleService = {
  createDoctorScheduleIntoDB,
  getDoctorScheduleFromDB,
  deleteDoctorScheduleFromDB,
  getAllFromDB,
};
