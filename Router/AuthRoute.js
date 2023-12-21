import { Router } from 'express';
import { Register, Login, logout } from '../Controller/AuthController.js';
import { validateLoginInput, validateRegisterInput } from '../middleware/validationMiddleware.js';

const router = Router();

// router.get('/', getAllCustomer);
router.post('/register', validateRegisterInput, Register);
router.post('/login', validateLoginInput, Login);
router.get('/logout', logout);

export default router;
