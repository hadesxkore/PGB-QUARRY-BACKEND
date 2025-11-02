import express from 'express';
import {
  getTrucks,
  getAllTrucks,
  getTruck,
  createTruck,
  updateTruck,
  deleteTruck
} from '../controllers/truck.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getTrucks)
  .post(createTruck);

router.get('/all', getAllTrucks); // Admin endpoint to get all trucks

router.route('/:id')
  .get(getTruck)
  .put(updateTruck)
  .delete(deleteTruck);

export default router;
