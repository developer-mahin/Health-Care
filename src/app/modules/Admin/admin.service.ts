import { Admin, Prisma, UserStatus } from "@prisma/client";
import calculatePagination from "../../utils/calculatePaginate";
import prisma from "../../utils/prisma";
import { searchableFields } from "./admin.constant";
import { TAdminFiltering } from "./admin.interface";
import { TPagination } from "../../types/pagination";

const getAllAdminFromDB = async (
  query: TAdminFiltering,
  options: TPagination
) => {
  const { limit, page, skip, sortBy, sortOrder } = calculatePagination(options);
  const { searchTerm, ...queryObj } = query;

  const andCondition: Prisma.AdminWhereInput[] = [];

  if (query?.searchTerm) {
    andCondition.push({
      OR: searchableFields.map((fields) => ({
        [fields]: {
          contains: query.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(queryObj).length > 0) {
    andCondition.push({
      AND: Object.keys(queryObj).map((key) => ({
        [key]: {
          equals: (queryObj as any)[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip,
    take: limit,
    orderBy:
      sortBy && sortOrder
        ? {
            [options.sortBy as any]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  const countData = await prisma.admin.count({
    where: whereCondition,
  });

  return {
    meta: {
      page,
      limit,
      total: countData,
    },
    result,
  };
};

const getSingleAdminFromDB = async (id: string) => {
  const result = await prisma.admin.findUnique({
    where: {
      id,
    },
  });
  return result;
};

const updateAdminIntoDB = async (id: string, payload: Partial<Admin>) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.admin.update({
    where: {
      id,
    },
    data: payload,
  });
  return result;
};

const deleteAdminAdminFromDB = async (id: string) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.delete({
      where: {
        id,
      },
    });

    await transactionClient.user.delete({
      where: {
        email: adminDeletedData.email,
      },
    });

    return adminDeletedData;
  });
  return result;
};

const softDeleteAdminFromDB = async (id: string) => {
  await prisma.admin.findFirstOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.$transaction(async (transactionClient) => {
    const adminDeletedData = await transactionClient.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });

    await transactionClient.user.update({
      where: {
        email: adminDeletedData.email,
      },
      data: {
        isDeleted: true,
      },
    });

    return adminDeletedData;
  });
  return result;
};

export const adminServices = {
  getAllAdminFromDB,
  getSingleAdminFromDB,
  updateAdminIntoDB,
  deleteAdminAdminFromDB,
  softDeleteAdminFromDB,
};
