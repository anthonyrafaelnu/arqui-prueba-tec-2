import mongoose, { Document, Schema } from 'mongoose';

export interface IData extends Document {
  User: string;
  Edad: number;
}

const DataSchema: Schema = new Schema({
  User: { type: String, required: true },
  Edad: { type: Number, required: true },
});

export const DataModel = mongoose.model<IData>('Data', DataSchema);