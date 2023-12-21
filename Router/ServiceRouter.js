import { Router } from 'express';
import { createSerice, deleteService, editService, getAllService, getSingleService } from '../Controller/ServiceController.js';
import { validationServiceInput, validateIdParam } from '../middleware/validationMiddleware.js';

const router = Router();

router.route('/').get(getAllService).post(validationServiceInput, createSerice);
router.route('/:id').get(validateIdParam, getSingleService).patch(validationServiceInput, validateIdParam, editService).delete(validateIdParam, deleteService);

export default router;
