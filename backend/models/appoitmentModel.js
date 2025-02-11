import { model, Schema } from "mongoose";

const appointmentSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    doctorEmail: { type: String, required: true },  // Added doctorEmail field
    appointmentDate: { type: Date, required: true }, 
    status: { type: String, default: "Scheduled", enum: ["Scheduled", "Completed", "Cancelled"] }, 
  },
  { timestamps: true }
);

const appointmentModel = model("Appointment", appointmentSchema);

export default appointmentModel;
