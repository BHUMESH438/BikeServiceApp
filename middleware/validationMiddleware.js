import { param, body, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError, UnauthenticatedError, UnauthorizedError } from '../error/CustomError.js';
import { BOOKING_STATUS, SERVICE_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import ServiceModel from '../model/ServiceModel.js';
import UserModel from '../model/UserSchema.js';

//validation for empty value inputs(badreq) -seting up the fn for reusability
const withValidationErrors = validateValues => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      console.log('error form val', errors);
      console.log('error form val', errors.isEmpty());
      // isemty [] = false; isempty [,12,]=true
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg);
        console.log('>>>>>>>>>>>', errorMessage);
        if (errorMessage[0].startsWith('service not') || errorMessage[0].startsWith('invalid credentials')) {
          throw new NotFoundError(errorMessage);
        }
        if (errorMessage[0].startsWith('invalid MongoDB')) {
          throw new BadRequestError(errorMessage);
        }
        if (errorMessage[0].startsWith('not authorized')) {
          throw new UnauthorizedError('not authorized to access this route');
        }
        // other common error in the error array
        throw new BadRequestError(errorMessage);
      }
      next();
    }
  ];
};

export const validationServiceInput = withValidationErrors([
  // validation for input property in schema
  body('serviceType').notEmpty().withMessage('serviceType is required'),
  body('bookings').notEmpty().withMessage('bookings is required'),
  body('serviceLocation').notEmpty().withMessage('serviceLocation is required'),
  //validation for constant in schema
  body('serviceType').isIn(Object.values(SERVICE_TYPE)).withMessage('invalid service value'),
  body('bookings').isIn(Object.values(BOOKING_STATUS)).withMessage('invalid bookings status value')
]);

//validate id params
export const validateIdParam = withValidationErrors([
  param('id')
    // if false we kick back the response viceversa
    // explicit as custom is async
    .custom(async (value, { req }) => {
      //true/false no structure -400
      const isValid = mongoose.Types.ObjectId.isValid(value);
      if (!isValid) {
        throw new BadRequestError('invalid MongoDB id');
      }
      // structure different value id - 404
      const service = await ServiceModel.findById(value);
      if (!service) throw new NotFoundError(`service not found by :${value}`);
      const isAdmin = req.user.role === 'admin';
      const isOwner = req.user.userId === service.createdBy.toString();
      if (!isAdmin && !isOwner) throw new Error('not authorized to access this route');
    })
  // .withMessage('invalid mogoDB id')
]);

export const validateRegisterInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email')
    .custom(async email => {
      const user = await UserModel.findOne({ email });
      if (user) {
        throw new BadRequestError('email already exists');
      }
    }),
  body('password').notEmpty().withMessage('password is required').isLength({ min: 8 }).withMessage('password must be at least 8 characters long'),
  body('phone').notEmpty().withMessage('phone number is required').isLength({ min: 10 }).withMessage('phone number must be 10 digit'),
  body('location').notEmpty().withMessage('location is required')
]);

export const validateLoginInput = withValidationErrors([
  // email and password
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async email => {
      const user = await UserModel.findOne({ email });
      if (!user) throw new UnauthenticatedError('invalid credentials');
    }),
  body('password').notEmpty().withMessage('password is required')
]);

export const validateUpdateUserInput = withValidationErrors([
  body('name').notEmpty().withMessage('name is required'),
  body('email')
    .notEmpty()
    .withMessage('email is required')
    .isEmail()
    .withMessage('invalid email format')
    .custom(async (email, { req }) => {
      const user = await UserModel.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error('email already exists');
      }
    }),
  body('phone').notEmpty().withMessage('phone number is required').isLength({ min: 10 }).withMessage('phone number must be 10 digit'),
  body('location').notEmpty().withMessage('location is required')
]);
