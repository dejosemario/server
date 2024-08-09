import User from "../models/users.model";

export default class UserService {
  public async findById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw { message: "User not found", statusCode: 404 };
    return user;
  }
}
