import mongoose, { Schema } from "mongoose";

const prescriptionSchema = new Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    medications: [
      {
        name: { type: String, required: true }, // Medicine name
        dosage: { type: String, required: true }, // e.g., "1 tablet twice a day"
        duration: { type: String, required: true }, // e.g., "7 days"
      },
    ],
    diagnosis: { type: String, required: true }, // Diagnosis details
    issuedAt: { type: Date, default: Date.now }, // Prescription issue date
    notes: { type: String }, // Additional instructions
  },
  { timestamps: true }
);

const Prescription = mongoose.model("Prescription", prescriptionSchema);

export default Prescription;
