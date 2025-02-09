import { model, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    name: String,
    specialization: String,
    experience: String,
    availability: String, // Available time slots
  },
  { timestamps: true }
);

const doctorModel = model("doctor", doctorSchema);

export default doctorModel;
