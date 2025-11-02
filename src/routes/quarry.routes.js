import express from 'express';
import {
  getQuarries,
  getQuarry,
  createQuarry,
  updateQuarry,
  deleteQuarry
} from '../controllers/quarry.controller.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.route('/')
  .get(getQuarries)
  .post(createQuarry);

router.route('/:id')
  .get(getQuarry)
  .put(updateQuarry)
  .delete(deleteQuarry);

export default router;
