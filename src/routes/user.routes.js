import express from 'express';
import { createUser, getUsers, getUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

router.post('/', authorize('admin', 'superadmin'), createUser);
router.get('/', authorize('admin', 'superadmin'), getUsers);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.delete('/:id', authorize('admin', 'superadmin'), deleteUser);

export default router;
