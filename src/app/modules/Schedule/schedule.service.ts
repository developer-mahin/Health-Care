import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";
import { Prisma, Schedule } from "@prisma/client";
import { TScheduleData } from "./schedule.interface";
import calculatePagination from "../../utils/calculatePaginate";
import { IAuthUser } from "../../interface/common";

const createScheduleIntoDB = async (
  payload: TScheduleData
): Promise<Schedule[] | null> => {
  const { startDate, endDate, startTime, endTime } = payload;

  const scheduleData = [];
  const intervalTime = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(startTime.split(":")[0])
        ),
        Number(startTime.split(":")[1])
      )
    );

    const endDateTime = new Date(
      addMinutes(
        addHours(
          `${format(currentDate, "yyyy-MM-dd")}`,
          Number(endTime.split(":")[0])
        ),
        Number(endTime.split(":")[1])
      )
    );

    while (startDateTime < endDateTime) {
      const schedule = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, intervalTime),
      };

      const isExistSchedule = await prisma.schedule.findFirst({
        where: {
          startDate: schedule.startDate,
          endDate: schedule.endDate,
        },
      });

      if (!isExistSchedule) {
        const result = await prisma.schedule.create({
          data: schedule,
        });

        scheduleData.push(result);
      }

      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return scheduleData;
};

const getAllScheduleFromDB = async (
  filters: any,
  options: any,
  user: IAuthUser
) => {
  const { limit, page, skip } = calculatePagination(options);
  const { startDateTime, endDateTime, ...filterData } = filters; // Extracting startDate and endDate from filters

  console.log(startDateTime, endDateTime);
  const andConditions = [];

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

  if (startDateTime && endDateTime) {
    andConditions.push({
      AND: [
        {
          startDate: {
            gte: startDateTime,
          },
        },
        {
          endDate: {
            lte: endDateTime,
          },
        },
      ],
    });
  }

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user?.email,
      },
    },
  });

  const doctorScheduleId = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleId,
      },
    },
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? { [options.sortBy]: options.sortOrder }
        : {
            createdAt: "desc",
          },
  });
  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleId,
      },
    },
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

export const ScheduleService = {
  createScheduleIntoDB,
  getAllScheduleFromDB,
};
