export const customerAgentSearchableFields = [
  'firstName',
  'lastName',
  'email',
  'contactNo',
];

export const customerAgentFilterableFields = ['searchTerm', 'gender', 'id'];

export const customerAgentRelationalFields = ['userId'];

export const customerAgentRelationalFieldsMapper: {
  [key: string]: string;
} = {
  userId: 'user',
};

export const customerAgentSelectedItems = {
  blogs: true,
  bookings: true,
  reviews: true,
  faqs: true,
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
