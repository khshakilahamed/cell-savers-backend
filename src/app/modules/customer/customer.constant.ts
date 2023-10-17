export const customerSearchableFields = [
  'firstName',
  'lastName',
  'email',
  'contactNo',
];

export const customerFilterableFields = ['searchTerm', 'gender', 'id'];

export const customerSelectedItems = {
  bookings: true,
  reviews: true,
  user: {
    select: {
      email: true,
      role: true,
      roleId: true,
      createdAt: true,
      updatedAt: true,
    },
  },
};
