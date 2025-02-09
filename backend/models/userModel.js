import { model, Schema } from "mongoose";

const userSchema = new Schema({
  fname: String,
  lname: String,
  email: String,
  password: String,
});

const userModel = model("user", userSchema);

export default userModel;
