import express from 'express';
import {
  getAdminTruckLogs,
  getAdminTruckLog,
  createAdminTruckLog,
  updateAdminTruckLog,
  deleteAdminTruckLog,
  getAdminTruckLogStats
} from '../controllers/adminTruckLog.controller.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Protect all routes
router.use(protect);

// Admin only routes
router.use(authorize('admin', 'superadmin'));

router.route('/')
  .get(getAdminTruckLogs)
  .post(createAdminTruckLog);

router.route('/stats')
  .get(getAdminTruckLogStats);

router.route('/:id')
  .get(getAdminTruckLog)
  .put(updateAdminTruckLog)
  .delete(deleteAdminTruckLog);

export default router;
