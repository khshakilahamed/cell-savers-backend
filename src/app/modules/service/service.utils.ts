import prisma from '../../../shared/prisma';
import { ITimeSlotPayload } from './service.interface';

export const timeSlotConflict = async (
  payload: ITimeSlotPayload,
): Promise<boolean> => {
  const { startTime, endTime } = payload;

  const existingTimeSlots = await prisma.timeSlot.findMany();

  for (const slot of existingTimeSlots) {
    const existingStartTime = new Date(`1970-01-01T${slot.startTime}:00`);
    const existingEndTime = new Date(`1970-01-01T${slot.endTime}:00`);
    const newStartTime = new Date(`1970-01-01T${startTime}:00`);
    const newEndTime = new Date(`1970-01-01T${endTime}:00`);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
