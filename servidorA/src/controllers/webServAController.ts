import { Request, Response } from 'express';
import * as webServAService from '../services/webServAService';

export const postData = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = req.body;
    console.log('Data recibida', data);
    await webServAService.saveData(data);
    res.status(200).send('Data recibida');
  } catch (error) {
    console.log(error);
    res.status(400).send("Datos incompletos");
  }
};

export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const authNumber = req.params.authNumber;
    const data = await webServAService.getData(authNumber);
    res.status(200).json(data);
  } catch (error) {
    res.status(404).send("Dato no encontrado");
  }
};