```js
import * as dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import { nanoid } from 'nanoid';

let ServiceDetails = [];
let Bookings = [];
let Customers = [];

//get .env values best practice
dotenv.config();

//server
const app = express();

//in dev environment morgan works
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//middleware
app.use(express.json());

//routes for owner/admin creating,editting, getting jobs--------------
// Should be able to create / edit / delete all his services and their details

//create service
app.post('/bikeapi/v1/service', (req, res) => {
  const { serviceType } = req.body;
  // should add return to avoid server compiler error: cannot set to the headers
  if (!serviceType) {
    return res.status(400).json({ msg: 'please provide serviceType' });
  }
  const id = nanoid();
  const ServiceDetail = { id, serviceType };
  ServiceDetails.push(ServiceDetail);
  res.status(201).json({ ServiceDetail });
});

//get all servive
app.get('/bikeapi/v1/services', (req, res) => {
  res.status(200).json({ ServiceDetails });
});

//getsingle service
app.get('/bikeapi/v1/service/:id', (req, res) => {
  const { id } = req.params;
  const singleServiceDetail = ServiceDetails.find(service => service.id === id);
  if (!singleServiceDetail) {
    return res.status(404).json({ msg: 'service not found' });
  }
  res.status(200).json({ singleServiceDetail });
});

//edit service
app.patch('/bikeapi/v1/service/:id', (req, res) => {
  const { serviceType } = req.body;
  if (!serviceType) {
    return res.status(400).json({ msg: 'please provide both the serviceType and booking' });
  }
  const { id } = req.params;
  const editService = ServiceDetails.find(service => service.id === id);
  if (!editService) {
    return res.status(404).json({ msg: 'service id did not match' });
  }
  editService.serviceType = serviceType;
  res.status(200).json({ editService, msg: 'service modified' });
});

//delete service
app.delete('/bikeapi/v1/service/:id', (req, res) => {
  const { id } = req.params;
  const deleteService = ServiceDetails.find(service => service.id === id);
  if (!deleteService) {
    return res.status(404).json({ msg: 'service id did not match' });
  }
  const newService = ServiceDetails.filter(service => service.id !== id);
  ServiceDetails = newService;
  res.status(200).json({ ServiceDetails, msg: 'service deleted' });
});

// Route for customer/user registration------------------------------
app.post('/bikeapi/v1/customer/register', (req, res) => {
  const { name, email, password, mobile } = req.body;
  const CustomerRegister = Customers.find(customer => customer.email === email);
  if (CustomerRegister) {
    console.log('>>>>>>>>>>>>1234', CustomerRegister);
    return res.status(409).json({ msg: 'resource alredy exist' });
  }
  if (!name || !email || !password || !mobile) {
    return res.status(404).json({ msg: 'fill all details' });
  }
  const newCustomer = { id: nanoid(), name, email, password, mobile };
  Customers.push(newCustomer);
  res.status(201).json({ msg: 'customer registerd successfully' });
});

//routes for customer to create bookings
app.post('/bikeapi/v1/customer/booking', (req, res) => {
  const { customerId, serviceId, bookingDate } = req.body;
  const customer = Customers.find(cust => cust.id === customerId);
  console.log('>>>>>>>>>>>>customer', customer);
  const service = ServiceDetails.find(serv => serv.id === serviceId);
  console.log('>>>>>>>>>>>>service', service);
  if (!customer || !service) {
    return res.status(404).json({ msg: 'Customer or service not found' });
  }
  const newBooking = { id: nanoid(), customerId, serviceId, bookingDate, status: 'pending' };
  Bookings.push(newBooking);

  //send email to the owner when the booking is created
  res.status(201).json({ newBooking, msg: 'booking created successfully' });
});

//View a list of all bookings ( pending, ready for delivery and completed)

app.get('/bikeapi/v1/bookings', (req, res) => {
  res.status(200).json({ Bookings });
});

//view all customerlist
app.get('/bikeapi/v1/customers', (req, res) => {
  res.status(200).json({ Customers });
});

// Route to view details of each booking
app.get('/bikeapi/v1/booking/:id', (req, res) => {
  const { id } = req.params;
  const singleBooking = Bookings.find(booking => booking.id === id);
  if (!singleBooking) {
    return res.status(404).json({ msg: 'Booking not found' });
  }
  res.status(200).json({ singleBooking });
});

// Route to mark a booking ready for delivery-admin
// Receive an email as soon as his booking is ready for delivery-user
app.patch('/bikeapi/v1/booking/:id', (req, res) => {
  const { id } = req.params;
  const editBookingsReady = Bookings.find(booking => booking.id === id);
  if (!editBookingsReady) {
    return res.status(404).json({ msg: 'Booking not found' });
  }
  editbookingCompleted.status = 'ready';

  // Add code to send email notification to the bike station owner
  // sendEmailNotification('Booking Ready for Delivery', editBookingsReady);

  res.status(200).json({ editBookingsReady, msg: 'Booking marked as ready for delivery' });
});

//route for the customer to see the status of their bookings-user
app.get('/bikeapi/v1/customer/bookings/:id', (req, res) => {
  const { id } = req.params;
  const customerBookings = Bookings.find(booking => booking.id === id);
  if (!customerBookings) {
    return res.status(404).json({ msg: 'Booking not found' });
  }
  res.status(200).json({ customerBookings });
});

// Route for customer to see all their previous bookings
app.get('/bikeapi/v1/customer/bookings/:customerId', (req, res) => {
  const { customerId } = req.params;
  const customerBookings = Bookings.filter(booking => booking.customerId === customerId);
  res.status(200).json({ customerBookings });
});

// Route to mark a booking as completed-admin
app.patch('/bikeapi/v1/booking/mark-completed/:id', (req, res) => {
  const { id } = req.params;
  const editbookingCompleted = Bookings.find(booking => booking.id === id);
  if (!editbookingCompleted) {
    return res.status(404).json({ msg: 'Booking not found' });
  }
  editbookingCompleted.status = 'completed';

  res.status(200).json({ editbookingCompleted, msg: 'Booking marked as completed' });
});

// if none of the above route mathch
app.use('*', (req, res) => {
  res.status(404).json({ msg: 'not found and none of the route mathch  ' });
});

//any resource is not avilable on the server express get the error response from the server methods and returns back the erro response
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).json({ msg: 'something went wrong' });
});

//server to port
const port = process.env.PORT || 5100;
app.listen(port, () => {
  console.log('app listening to 5000.....');
});
```

### shift logic to mvc pattern

### connect mongodb set the values as env variables

### connect DB using mongoose 7 abd above

```js
import mongoose from 'mongoose';
//server to port
const port = process.env.PORT || 5100;
try {
  await mongoose.connect(process.env.MONGO_URL);
  // console.log('DBurl ok connecting to db>>>>>');
  app.listen(port, () => console.log(`server connected to ${port}...`));
} catch (error) {
  console.log('server to DB connection error>>>>>>>>>>>>>', error);
  process.exit(1);
}
```

### modeling schema

crud for service and along side the servive the booking is also listed with the location

```js
import mongoose from 'mongoose';

const ServiceSchema = new mongoose.Schema(
  {
    serviceType: {
      type: String,
      enum: ['General', 'Oil', 'WaterWash'],
      default: 'General'
    },
    bookings: {
      type: String,
      enum: ['pending', 'ready', 'completed'],
      default: 'pending'
    },
    serviceLocation: {
      type: String,
      default: 'coimbatore'
    }
  },
  { timestamps: true }
);

export default mongoose.model('Service', ServiceSchema);
```

### add express async errors in server and if not used use the trycatch manual approach for error handling.

- By handling the error when the error comes it wont stop the server
- make sure the express async error at the top of the imprt list in server

[Express Async Errors](https://www.npmjs.com/package/express-async-errors)

### crud - serviceController

### setup custom error, once we extended the js error we can use it in many project

### set up validation layes to avoid default submit values i.e the values we defaultly given in the schema if empty value is passed to a obj property

### set-up utilites and constant

- by setting up validatoin controller can be slimmer
- avoid submissin of default value in the schema
- express validator helps to ease the use of validation and we can set it in the routes as middleware

### validate service input, validate job input, validate the input params. wethr the id doesnt match or exist

- if the custom response is false; value will return
- if the custom response is true; value will not be return
- give back the implecit return of the id from the mongoose
- if we alter the value 404 not found; if we add extra value to id validate error not allow to pass to the comtroller 400 bad req

```js
import { param, body, validationResult } from 'express-validator';
import { BadRequestError, NotFoundError } from '../error/CustomError.js';
import { BOOKING_STATUS, SERVICE_TYPE } from '../utils/constants.js';
import mongoose from 'mongoose';
import ServiceModel from '../model/ServiceModel.js';

//validation for empty value inputs(badreq) -seting up the fn for reusability
const withValidationErrors = validateValues => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      console.log(errors);
      // isemty [] = false; isempty [,12,]=true
      if (!errors.isEmpty()) {
        const errorMessage = errors.array().map(error => error.msg);
        console.log(errorMessage);
        if (errorMessage[0].startsWith('service not')) {
          throw new NotFoundError(errorMessage);
        }
        if (errorMessage[0].startsWith('invalid MongoDB')) {
          throw new BadRequestError(errorMessage);
        }
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
    .custom(async value => {
      //true/false no structure -400
      const isValid = mongoose.Types.ObjectId.isValid(value);
      if (!isValid) {
        throw new BadRequestError('invalid MongoDB id');
      }
      // structure different value id - 404
      const service = await ServiceModel.findById(value);
      if (!service) throw new NotFoundError(`service not found by :${value}`);
    })
  // .withMessage('invalid mogoDB id')
]);
```

### model user schema

```js
import mongoose from 'mongoose';

const UserModelSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  location: {
    type: String,
    default: 'gandhipuram,coimbatore'
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  }
});

export default mongoose.model('User', UserModelSchema);
```

### validation for register form

```js
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
  body('phone').notEmpty().withMessage('phone number is required').isLength({ min: 8 }).withMessage('phone number must be 10 digit'),
  body('location').notEmpty().withMessage('location is required')
]);
```

### use it auth route

```js
router.post('/register', validateRegisterInput, Register);
```

### role based auth

```js
export const Register = async (req, res) => {
  const isFirstAccount = (await UserShema.countDocuments()) === 0;
  req.body.role = isFirstAccount ? 'admin' : 'user';

```

### hash password while registering

utils/passwordUtils.js

<!-- optional -->

### use custom validation for email in login

```js
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
```

### cmpare hashed password while logging in

utils/passwordUtils.js

### create jwt token

utils/tokenUtils.js

### after creating the jwt token in the login send it tthe frontend it gets saved

```js
const token = createJWT({ userId: user._id, role: user.role });
const oneday = 1000 * 60 * 60 * 24;
res.cookie('token', token, {
  httpOnly: true,
  expires: new Date(Date.now() + oneday),
  secure: process.env.NODE_ENV === 'production'
});
```

- save and secure it in the httponly token

### Link the service schmea by user schema

### create auth middleware

### pass the user obj to the service controller using the authmiddlewere

### secure the single auth middleware by checking the login userid with the req.user which is passed from the authmiddlewere to the service controller

- so after that we can compare the paramid with the req.user auth so that we can avoid accessing of the single id with the logged in user

### logout contoeller

### create user route and controller

- get current user 1.remove password and send the res
- for update user we will findandupdate by userId and req.body and we willnot give back the response in the update user route instead we will get the user update in the getcurrent user route

### create user route and user controller

### setup proxy and cors in client and server to connect

### connect the register and login

- use actoins, Form,Links provided by react-router-dom

### Build dashBoard Page

```js
import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdOutlineDashboard } from 'react-icons/md';
import { RiSettings4Line } from 'react-icons/ri';
import { TbReportAnalytics } from 'react-icons/tb';
import { AiOutlineUser, AiOutlineHeart } from 'react-icons/ai';
import { FiMessageSquare, FiFolder, FiShoppingCart } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const menus = [
    { name: 'dashboard', link: '/dashboard/servicelist', icon: MdOutlineDashboard },
    { name: 'user', link: '/dashboard/status', icon: AiOutlineUser }
  ];
  const [open, setOpen] = useState(true);
  return (
    <>
      <section className='flex gap-6'>
        <div className={`bg-[#0e0e0e] min-h-screen ${open ? 'w-72' : 'w-16'} duration-500 text-gray-100 px-4`}>
          <div className='py-3 flex justify-end' onClick={() => setOpen(!open)}>
            <HiMenuAlt3 size={26} className='cursor-pointer' />
          </div>
          <div className='mt-4 flex flex-col gap-4 relative'>
            {menus?.map((menu, i) => (
              <Link to={menu?.link} key={i} className={` ${menu?.margin && 'mt-5'} group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}>
                <div>{React.createElement(menu?.icon, { size: '20' })}</div>
                <h2
                  style={{
                    transitionDelay: `${i + 3}00ms`
                  }}
                  className={`whitespace-pre duration-500 ${!open && 'opacity-0 translate-x-28 overflow-hidden'}`}
                >
                  {menu?.name}
                </h2>
                <h2 className={`${open && 'hidden'} absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}>{menu?.name}</h2>
              </Link>
            ))}
          </div>
        </div>
        <div>REACT TAILWIND</div>
        {/* className='m-3 text-xl text-gray-900 font-semibold' */}
      </section>
    </>
  );
};
export default NavBar;
```
