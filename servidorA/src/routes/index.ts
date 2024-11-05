import express from 'express';
import { postData, getAuthorization, postAuthorization } from '../controllers/webServAController';

const router = express.Router();

router.post('/data', postData);
router.post('/authorization', postAuthorization);
router.get('/authorization/:authNumber', getAuthorization);

export default router;