import { model, Schema } from "mongoose";

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
  role:String,
  forgototp:Number,
});

const userModel = model("User", userSchema);

export default userModel;
