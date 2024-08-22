const USERS = [];

const getUserByEmail = (email) => {
  return USERS.find((user) => user.email === email);
};
const getUserById = (id) => {
  return USERS.find((user) => user.id === id);
};
const createUser = (id, email, passkey) => {
  return USERS.push({ id, email, passkey });
};
const updateUser = (id, counter) => {
  const user = USERS.find((user) => user.id === id);
  user.passkey.counter = counter;
};

export { getUserByEmail, getUserById, createUser, updateUser };
