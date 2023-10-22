export type IFeedBackPayload = {
  comment: string;
};

export type IFeedbackFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
  isSelected?: boolean | string | undefined;
};
