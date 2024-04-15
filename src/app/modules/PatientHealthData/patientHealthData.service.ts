import { Patient, Prisma, UserStatus } from "@prisma/client";
import {
  IPatientFilterRequest,
  IPatientUpdate,
} from "./patientHealthData.interface";
import { TPagination } from "../../types/pagination";
import calculatePagination from "../../utils/calculatePaginate";
import { patientSearchableFields } from "./patientHealthData.constant";
import prisma from "../../utils/prisma";

const getAllFromDB = async (
  filters: IPatientFilterRequest,
  options: TPagination
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { searchTerm, ...filterData } = filters;

  const andConditions = [];

  if (searchTerm) {
    andConditions.push({
      OR: patientSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
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
  andConditions.push({
    isDeleted: false,
  });

  const whereConditions: Prisma.PatientWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.patient.findMany({
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
      medicalReport: true,
      patientHealthData: true,
    },
  });
  const total = await prisma.patient.count({
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

const getByIdFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.patient.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      medicalReport: true,
      patientHealthData: true,
    },
  });
  return result;
};

const updateIntoDB = async (
  id: string,
  payload: Partial<IPatientUpdate>
): Promise<Patient | null> => {
  const { patientHealthData, medicalReport, ...patientData } = payload;

  const patientInfo = await prisma.patient.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  await prisma.$transaction(async (transactionClient) => {
    await transactionClient.patient.update({
      where: {
        id: patientInfo.id,
      },
      data: patientData,
    });

    if (patientHealthData) {
      await transactionClient.patientHealthData.upsert({
        where: {
          patientId: patientInfo.id,
        },
        update: patientHealthData,
        create: { patientId: patientInfo.id, ...patientHealthData },
      });
    }

    if (medicalReport) {
      await transactionClient.medicalReport.create({
        data: {
          patientId: patientInfo.id,
          ...medicalReport,
        },
      });
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      id: patientInfo.id,
    },
    include: {
      patientHealthData: true,
      medicalReport: true,
    },
  });

  return result;
};

const deleteFromDB = async (id: string): Promise<Patient | null> => {
  const result = await prisma.$transaction(async (tx) => {
    // delete medical report
    const medicalReport = await tx.medicalReport.findMany({
      where: {
        patientId: id,
      },
    });

    if (medicalReport) {
      await tx.medicalReport.deleteMany({
        where: {
          patientId: id,
        },
      });
    }

    // delete patient health data
    const patientHealthData = await tx.patientHealthData.findUnique({
      where: {
        patientId: id,
      },
    });
    if (patientHealthData) {
      await tx.patientHealthData.delete({
        where: {
          patientId: id,
        },
      });
    }

    const deletedPatient = await tx.patient.delete({
      where: {
        id,
      },
    });

    await tx.user.delete({
      where: {
        email: deletedPatient.email,
      },
    });

    return deletedPatient;
  });

  return result;
};

const softDelete = async (id: string): Promise<Patient | null> => {
  return await prisma.$transaction(async (transactionClient) => {
    const deletedPatient = await transactionClient.patient.update({
      where: { id },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: deletedPatient.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });

    return deletedPatient;
  });
};

export const PatientService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
  softDelete,
};
