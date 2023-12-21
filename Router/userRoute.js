import { Router } from 'express';
import { getApplicationStats, getCurrentUser, updateUser } from '../Controller/UserController.js';
import { authorizePermissions } from '../middleware/authMiddleware.js';
import { validateUpdateUserInput } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/current-user', getCurrentUser);
router.get('/admin/app-stats', [authorizePermissions('admin'), getApplicationStats]);
router.patch('/update-user', validateUpdateUserInput, updateUser);
export default router;
