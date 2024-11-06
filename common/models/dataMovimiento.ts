import mongoose, { Document, Schema } from 'mongoose';

export interface IDataMovement extends Document {
    authorizationNumber: string;
    movementDate: Date;
    accountFrom: string;
    accountTo: string;
    destinationBank: string;
    currency: string;
    amount: number;
}

const DataSchema: Schema = new Schema({
    authorizationNumber: { type: String, required: true },
    movementDate: { type: Date, required: true },
    accountFrom: { type: String, required: true },
    accountTo: { type: String, required: true },
    destinationBank: { type: String, required: true },
    currency: { type: String, required: true },
    amount: { type: Number, required: true },
});

export const DataMovement = mongoose.model<IDataMovement>('DataMovement', DataSchema);