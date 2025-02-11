// import { model, Schema } from "mongoose";

// const doctorSchema = new Schema(
//   {
//     name: String,
//     email: String,
//     password: String, 
//     specialization: String,
//     experience: String,
//     role:String,
// //date
//     availability: [String], // Available time slots
//   },
//   { timestamps: true }
// );

// const doctorModel = model("doctor", doctorSchema);

// export default doctorModel;


import { model, Schema } from "mongoose";

const doctorSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, 
    specialization: { type: String, required: true },
    experience: { type: String, required: true },
    role: { type: String, default: "doctor" }, 
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
