export const cropUserData = (user) => {
  const { name, email, gender, daily_norma } = user;
  return {
    name,
    email,
    gender,
    daily_norma,
  };
};
