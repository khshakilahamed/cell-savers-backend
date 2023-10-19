export type IBlogPayload = {
  title: string;
  image?: string | null;
  description: string;
};

export type IBlogFilterRequest = {
  searchTerm?: string | undefined;
  id?: string | undefined;
};
