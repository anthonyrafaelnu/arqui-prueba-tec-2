import { Request, Response } from 'express';
import * as webServBService from '../services/webServBService';

export const getAllData = async (req: Request, res: Response): Promise<void> => {
  const data = await webServBService.getAllData();
  res.status(200).json(data);
};