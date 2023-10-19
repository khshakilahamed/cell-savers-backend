export type IFAQPayload = {
  question: string;
  answer: string;
};

export type IFaqFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
