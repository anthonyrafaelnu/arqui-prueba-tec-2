import express from 'express';
import { postData, getData } from '../controllers/webServAController';

const router = express.Router();

router.post('/movements', postData);
router.get('/movements/:authNumber', getData);

export default router;