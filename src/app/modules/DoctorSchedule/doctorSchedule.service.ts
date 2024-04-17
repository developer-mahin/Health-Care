import { TAuthUser } from "../../interface";
import prisma from "../../utils/prisma";

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

export const DoctorScheduleService = {
  createDoctorScheduleIntoDB,
};
