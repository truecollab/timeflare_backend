const allRoles = {
  user: [
    'getUsers',
    'manageUsers',
    'manageProject',
    'getProject',
    'manageMembers',
    'createTimelog',
    'getTimelogById',
    'getAllTimelog',
    'getTimelogByTimeframe',
    'getReport',
    'sendEmail',
  ],
  admin: ['getUsers', 'manageUsers'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
