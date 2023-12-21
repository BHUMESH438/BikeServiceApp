import { StatusCodes } from 'http-status-codes';
import UserShema from '../model/UserSchema.js';
import { comparePassword, hashPassword } from '../utils/passwordUtils.js';
import { UnauthenticatedError } from '../error/CustomError.js';
import { createJWT } from '../utils/tokenUtils.js';

export const Register = async (req, res) => {
  // hash password
  const hashedPassword = await hashPassword(req.body.password);
  req.body.password = hashedPassword;
  // assgin role
  const isFirstAccount = (await UserShema.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';
  //create user
  const user = await UserShema.create(req.body);
  res.status(StatusCodes.CREATED).json({ user });
};

export const Login = async (req, res) => {
  const user = await UserShema.findOne({ email: req.body.email });
  const passwordMatch = await comparePassword(req.body.password, user.password);
  if (!user || !passwordMatch) throw new UnauthenticatedError('invalid credentials');
  console.log(user.role, user._id);
  // createroken put excpire date
  const token = createJWT({ userId: user._id, role: user.role });
  const oneDay = 1000 * 60 * 60 * 24;
  //store token with userid and role credentials in the local/cookie storage
  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === 'production'
  });

  res.status(StatusCodes.CREATED).json({ msg: 'user logged in' });
};

export const logout = (req, res) => {
  res.cookie('token', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now())
  });
  res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};
// export const getAllCustomer = async (req, res) => {
//   res.status(StatusCodes.OK).json({ Customers });
// };
