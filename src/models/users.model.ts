import mongoose, {Document, Schema} from "mongoose";

interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
  role: string; // For example, 'creator' or 'eventee'
}

const userSchema  = new Schema<UserDocument>(
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

// Add toJSON options
userSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, user) {
    delete user._id;
    delete user.password;
    return user;
  },
});


const User = mongoose.model<UserDocument>("User", userSchema);

export default User;
