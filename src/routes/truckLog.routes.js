import express from 'express';
import {
  createTruckLogs,
  getTruckLogs,
  getAllTruckLogs,
  getTruckLogStats,
  deleteTruckLog
} from '../controllers/truckLog.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTruckLogs)
  .post(createTruckLogs);

router.get('/all', getAllTruckLogs); // Admin endpoint to get all logs
router.get('/stats', getTruckLogStats);

router.delete('/:id', deleteTruckLog);

export default router;
