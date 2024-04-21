import {
  Appointment,
  AppointmentStatus,
  PaymentStatus,
  Prisma,
  UserRole,
} from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { IAuthUser, TGenericResponse } from "../../interface/common";
import { TPagination } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePaginate";
import prisma from "../../utils/prisma";
import {
  appointmentRelationalFields,
  appointmentRelationalFieldsMapper,
} from "./appointment.constant";
import { TAppointmentData } from "./appointment.interface";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const createAppointmentIntoDB = async (
  payload: TAppointmentData,
  user: IAuthUser
) => {
  const patientData = await prisma.patient.findUniqueOrThrow({
    where: {
      email: user?.email,
    },
  });

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where: {
      id: payload.doctorId,
    },
  });

  await prisma.doctorSchedules.findFirstOrThrow({
    where: {
      doctorId: doctorData.id,
      scheduleId: payload.scheduleId,
      isBooked: false,
    },
  });

  const videoCallingID = uuidv4();

  const result = await prisma.$transaction(async (tx) => {
    const appointmentData = await tx.appointment.create({
      data: {
        patientId: patientData.id,
        doctorId: doctorData.id,
        scheduleId: payload.scheduleId,
        videoCallingId: videoCallingID,
      },
      include: {
        patient: true,
        doctor: true,
        schedule: true,
      },
    });

    await tx.doctorSchedules.update({
      where: {
        doctorId_scheduleId: {
          doctorId: doctorData.id,
          scheduleId: payload.scheduleId,
        },
      },
      data: {
        isBooked: true,
        appointmentId: appointmentData.id,
      },
    });

    const today = new Date();
    const transactionId =
      "PH-Health-Care-" +
      today.getFullYear() +
      "-" +
      today.getMonth() +
      "-" +
      today.getHours() +
      "-" +
      today.getMinutes() +
      "-" +
      uuidv4();

    console.log(transactionId);

    await tx.payment.create({
      data: {
        appointmentId: appointmentData.id,
        amount: doctorData.appointmentFee,
        transactionId: transactionId,
      },
    });

    return appointmentData;
  });

  return result;
};

const getMyAppointment = async (
  filters: any,
  options: TPagination,
  authUser: IAuthUser
): Promise<TGenericResponse<Appointment[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const andConditions = [];

  if (authUser?.role === UserRole.PATIENT) {
    andConditions.push({
      patient: {
        email: authUser?.email,
      },
    });
  } else {
    andConditions.push({
      doctor: {
        email: authUser?.email,
      },
    });
  }

  if (Object.keys(filters).length > 0) {
    andConditions.push({
      AND: Object.keys(filters).map((key) => ({
        [key]: {
          equals: (filters as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include:
      authUser?.role === UserRole.PATIENT
        ? { doctor: true }
        : {
            patient: {
              include: { medicalReport: true, patientHealthData: true },
            },
          },
  });
  const total = await prisma.appointment.count({
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

const getAllFromDB = async (
  filters: any,
  options: TPagination
): Promise<TGenericResponse<Appointment[]>> => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;
  const andConditions = [];

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => {
        if (appointmentRelationalFields.includes(key)) {
          return {
            [appointmentRelationalFieldsMapper[key]]: {
              email: (filterData as any)[key],
            },
          };
        } else {
          return {
            [key]: {
              equals: (filterData as any)[key],
            },
          };
        }
      }),
    });
  }

  // console.dir(andConditions, { depth: Infinity })
  const whereConditions: Prisma.AppointmentWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.appointment.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
    include: {
      doctor: true,
      patient: true,
    },
  });
  const total = await prisma.appointment.count({
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

const changeAppointmentStatus = async (
  appointmentId: string,
  user: IAuthUser,
  payload: AppointmentStatus
) => {
  const appointmentData = await prisma.appointment.findUniqueOrThrow({
    where: {
      id: appointmentId,
    },
    include: {
      doctor: true,
    },
  });

  if (user?.role === UserRole.DOCTORS) {
    if (user.email !== appointmentData.doctor.email) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "This is not your appointment"
      );
    }
  }

  const result = await prisma.appointment.update({
    where: {
      id: appointmentData.id,
    },
    data: {
      status: payload?.status,
    },
  });

  return result;
};

const cancelUnpaidAppointment = async () => {
  const thirtyMinutesAgo = new Date(Date.now() - 1 * 60 * 1000);

  const unpaidAppointmentData = await prisma.appointment.findMany({
    where: {
      paymentStatus: PaymentStatus.UNPAID,
      createdAt: {
        lte: thirtyMinutesAgo,
      },
    },
  });

  const appointmentIsdToCancel = unpaidAppointmentData.map(
    (appointment) => appointment.id
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        appointmentId: {
          in: appointmentIsdToCancel,
        },
      },
    });

    await tx.appointment.deleteMany({
      where: {
        id: {
          in: appointmentIsdToCancel,
        },
      },
    });

    for (const unpaidAppoint of unpaidAppointmentData) {
      await tx.doctorSchedules.updateMany({
        where: {
          doctorId: unpaidAppoint.doctorId,
          scheduleId: unpaidAppoint.scheduleId,
        },
        data: {
          isBooked: false,
        },
      });
    }
  });
};

export const AppointmentServices = {
  createAppointmentIntoDB,
  getMyAppointment,
  getAllFromDB,
  changeAppointmentStatus,
  cancelUnpaidAppointment,
};
