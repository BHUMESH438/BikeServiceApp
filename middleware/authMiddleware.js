import { UnauthenticatedError } from '../error/CustomError.js';
import { verifyJWT } from '../utils/tokenUtils.js';
export const authenticateUser = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    throw new UnauthenticatedError('authentication invalid token not present in login');
  }

  try {
    const { userId, role } = verifyJWT(token);
    //passing the property from the decoded token to userOBJ
    req.user = { userId, role };
    next();
  } catch (error) {
    throw new UnauthenticatedError('authentication invalid credentials in token');
  }
};

export const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthorizedError('Unauthorized to access this route');
    }
    next();
  };
};
