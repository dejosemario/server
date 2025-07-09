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
    role: {
      type: String,
      enum: ["creator", "eventee"],
      default: "eventee",
    },
  },
  { timestamps: true }
);

userSchema.pre('findOneAndDelete', async function() {
  const userId = this.getQuery()._id;
  await mongoose.model('Booking').deleteMany({ user: userId });
});

userSchema.pre('deleteOne', async function() {
  const userId = this.getQuery()._id;
  await mongoose.model('Booking').deleteMany({ user: userId });
});

// Also handle deleteMany if you ever bulk delete users
userSchema.pre('deleteMany', async function() {
  const users = await this.model.find(this.getQuery());
  const userIds = users.map(user => user._id);
  await mongoose.model('Booking').deleteMany({ user: { $in: userIds } });
});

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
