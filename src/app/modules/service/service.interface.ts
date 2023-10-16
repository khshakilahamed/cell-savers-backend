export type IServicePayload = {
  title: string;
  price: number;
  image: string;
  description: string;
};

export type IServiceFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
