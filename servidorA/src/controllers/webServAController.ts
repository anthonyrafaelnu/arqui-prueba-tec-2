import { Request, Response } from 'express';
import * as webServAService from '../services/webServAService';

export const postData = async (req: Request, res: Response): Promise<void> => {
  const data = req.body;
  await webServAService.saveData(data);
  res.status(200).send('Data recibida');
};

export const getAuthorization = async (req: Request, res: Response): Promise<void> => {
  const authNumber = req.params.authNumber;
  const data = await webServAService.getAuth(authNumber);
  res.status(200).json(data);
};

export const postAuthorization = async (req: Request, res: Response): Promise<void> => {
  const authNumber = req.body.authNumber;
  await webServAService.saveAuth(authNumber);
  res.status(200).send('Autorización recibida');
};