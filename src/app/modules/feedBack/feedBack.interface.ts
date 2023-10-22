export type IFeedBackPayload = {
  comment: string;
};

export type IFeedbackFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
