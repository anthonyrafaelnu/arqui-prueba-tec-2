import { ObjectId } from 'mongodb';

export interface IData {
    _id?: ObjectId;
    User: string;
    Edad: number;
}