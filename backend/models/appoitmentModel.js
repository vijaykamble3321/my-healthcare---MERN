
import { model, Schema } from "mongoose";


const appointmentSchema = new Schema(
    {
      userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
      appointmentDate: { type: String, required: true }, // Format: "YYYY-MM-DD"
      status: { type: String, default: "Scheduled" }, // Other statuses could be "Completed", "Cancelled", etc.
    },
    { timestamps: true }
  );
  
  const appointmentModel = model("Appointment", appointmentSchema);
  
  export default appointmentModel;
  