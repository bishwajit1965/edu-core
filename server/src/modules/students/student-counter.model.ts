import { Schema, model, models } from "mongoose";

interface IStudentCounter {
  _id: string;
  sequence: number;
}

const studentCounterSchema = new Schema<IStudentCounter>({
  _id: { type: String, required: true },
  sequence: { type: Number, required: true, default: 0 },
});

export const StudentCounter = model<IStudentCounter>(
  "StudentCounter",
  studentCounterSchema,
);
