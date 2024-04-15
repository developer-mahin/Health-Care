import { addHours, addMinutes, format } from "date-fns";
import prisma from "../../utils/prisma";

const createScheduleIntoDB = async (payload: any) => {
  const { startDate, endDate, startTime, endTime } = payload;

  const scheduleData = [];
  const intervalTime = 30;
  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const startDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(startTime.split(":")[0])
      )
    );

    const endDateTime = new Date(
      addHours(
        `${format(currentDate, "yyyy-MM-dd")}`,
        Number(endTime.split(":")[0])
      )
    );

    while (startDateTime < endDateTime) {
      const schedule = {
        startDate: startDateTime,
        endDate: addMinutes(startDateTime, intervalTime),
      };

      const result = await prisma.schedule.create({
        data: schedule,
      });

      scheduleData.push(result);
      startDateTime.setMinutes(startDateTime.getMinutes() + intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return scheduleData;
};

export const ScheduleService = {
  createScheduleIntoDB,
};
