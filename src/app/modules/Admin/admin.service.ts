import { Prisma } from "@prisma/client";
import calculatePagination from "../../utils/calculatePaginate";
import prisma from "../../utils/prisma";
import { searchableFields } from "./admin.constant";

const getAllAdminFromDB = async (query: any, options: any) => {
  const { limit, page, sortBy, sortOrder } = calculatePagination(options);
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
          equals: queryObj[key],
        },
      })),
    });
  }

  const whereCondition: Prisma.AdminWhereInput = { AND: andCondition };

  const result = await prisma.admin.findMany({
    where: whereCondition,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    orderBy:
      sortBy && sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
  });

  return result;
};

export const adminServices = {
  getAllAdminFromDB,
};
