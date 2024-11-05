import express from 'express';
import { getAllData } from '../controllers/webServBController';

const router = express.Router();

router.get('/data', getAllData);

export default router;