import User from "../models/users.model";

export default class UserService {
  public async findById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw { message: "User not founddd", statusCode: 404 };
    return user;
  }

  public async updateUserRole(userId: string, newRole: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");
    if (!user) throw { message: "User not found", statusCode: 404 };
    return user;
  }
}
