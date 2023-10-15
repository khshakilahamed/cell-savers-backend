export const selectResponseItem = {
  id: true,
  email: true,
  role: true,
};

export const userSelectOptions = {
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  roleId: true,
  role: {
    select: {
      id: true,
      title: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};
