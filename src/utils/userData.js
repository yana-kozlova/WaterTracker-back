export const cropUserData = (user) => {
  const { name, email, gender, daily_norma, avatar_url } = user;
  return {
    name,
    email,
    gender,
    daily_norma,
    avatar_url,
  };
};
