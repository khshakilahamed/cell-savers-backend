export type IServicePayload = {
  title: string;
  price: number;
  description: string;
};

export type IServiceFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
