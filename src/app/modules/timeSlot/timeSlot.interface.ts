export type ITimeSlotPayload = {
  startTime: string;
  endTime: string;
};

export type ITimeSlotFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
