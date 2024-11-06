import express from 'express';
import { getDataInRange, getDataGroupByMonth } from '../controllers/webServBController';

const router = express.Router();

router.get('/movements-between-dates', getDataInRange);
router.get('/movements-grouped-by-month', getDataGroupByMonth);

export default router;