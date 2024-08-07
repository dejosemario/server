import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    // isAdmin: {
    //   type: Boolean,
    //   default: false,
    //   required: false,
    // },
    role: {
      type: String,
      enum: ["creator", "eventee"],
      default: "eventee",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
