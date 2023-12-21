import bcrypt from 'bcryptjs';
export const hashPassword = async password => {
  // genrate salt
  const salt = await bcrypt.genSalt(10);
  // combime the passwrod+salt
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
