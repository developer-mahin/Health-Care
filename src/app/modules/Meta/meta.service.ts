import { PaymentStatus, UserRole } from "@prisma/client";
import { IAuthUser } from "../../interface/common";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";
import prisma from "../../utils/prisma";

const fetchMetaData = async (user: IAuthUser) => {
  let metadata;
  switch (user?.role) {
    case UserRole.SUPER_ADMIN:
      metadata = superAdminMetaData();
      break;
    case UserRole.ADMIN:
      metadata = adminMetaData();
      break;
    case UserRole.DOCTORS:
      metadata = doctorMetaData(user as IAuthUser);
      break;
    case UserRole.PATIENT:
      metadata = patientMetaData(user as IAuthUser);
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

  return metadata;
};

const adminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  //   const barChartData = await getBarChartData();
  //   const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    paymentCount,
    totalRevenue,
    // barChartData,
    // pieChartData,
  };
};

const superAdminMetaData = async () => {
  const appointmentCount = await prisma.appointment.count();
  const patientCount = await prisma.patient.count();
  const doctorCount = await prisma.doctor.count();
  const adminCount = await prisma.admin.count();
  const paymentCount = await prisma.payment.count();

  const totalRevenue = await prisma.payment.aggregate({
    _sum: { amount: true },
    where: {
      status: PaymentStatus.PAID,
    },
  });

  //   const barChartData = await getBarChartData();
  //   const pieChartData = await getPieChartData();

  return {
    appointmentCount,
    patientCount,
    doctorCount,
    adminCount,
    paymentCount,
    totalRevenue,
    // barChartData,
    // pieChartData,
  };
};

const doctorMetaData = async (user: IAuthUser) => {
  const doctorData = await prisma.doctor.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!doctorData) {
    throw new Error("Doctor not found");
  }

  const appointmentCount = await prisma.appointment.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const patientCount = await prisma.appointment.groupBy({
    by: ["patientId"],
    _count: {
      id: true,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      doctorId: doctorData.id,
    },
  });

  const totalRevenue = await prisma.payment.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      appointment: {
        doctorId: doctorData.id,
      },
      status: PaymentStatus.PAID,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      doctorId: doctorData.id,
    },
  });
  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  console.log(appointmentCount);

  return {
    appointmentCount,
    patientCount: patientCount.length,
    reviewCount,
    totalRevenue,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution,
  };
};

const patientMetaData = async (user: IAuthUser) => {
  const patient = await prisma.patient.findUnique({
    where: {
      email: user?.email,
    },
  });

  if (!patient) {
    throw new AppError(httpStatus.BAD_REQUEST, "Patient not found!");
  }

  const appointmentCount = await prisma.appointment.count({
    where: {
      patientId: patient.id,
    },
  });

  const prescriptionCount = await prisma.prescription.count({
    where: {
      patientId: patient.id,
    },
  });

  const reviewCount = await prisma.review.count({
    where: {
      patientId: patient.id,
    },
  });

  const appointmentStatusDistribution = await prisma.appointment.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      patientId: patient.id,
    },
  });

  const formattedAppointmentStatusDistribution =
    appointmentStatusDistribution.map(({ status, _count }) => ({
      status,
      count: Number(_count.id),
    }));

  return {
    appointmentCount,
    reviewCount,
    prescriptionCount,
    appointmentStatusDistribution: formattedAppointmentStatusDistribution,
  };
};

export const MetaService = {
  fetchMetaData,
};
