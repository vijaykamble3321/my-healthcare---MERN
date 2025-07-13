import { model, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true },
    name: { type: String, required: true },
     email: { type: String, required: true },
    userid: {
      type: Schema.Types.ObjectId,
      ref: "users",
    },

    specialization: { type: String, required: true },
    experience: { type: String, required: true },

    availability: [
      {
        date: Date,
      },
    ],
  },
  { timestamps: true }
);

const doctorModel = model("Doctor", doctorSchema);

export default doctorModel;
