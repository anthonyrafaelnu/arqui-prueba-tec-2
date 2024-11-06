import { Request, Response } from 'express';
import * as webServBService from '../services/webServBService';

export const getDataInRange = async (req: Request, res: Response): Promise<void> => {
  const fromDate: Date | null = req.query.fromDate ? new Date(req.query.fromDate as string) : null;
  const toDate: Date | null = req.query.toDate ? new Date(req.query.toDate as string) : null;

  if (req.query.fromDate || req.query.toDate) {
    const data = await webServBService.getDataInRange(fromDate, toDate);
    res.status(200).json(data);
  } else {
    res.status(400).send('Fechas no proporcionadas');
    return;
  }
};

export const getDataGroupByMonth = async (req: Request, res: Response): Promise<void> => {
  const data = await webServBService.groupByMonth();
  res.status(200).json(data);
}