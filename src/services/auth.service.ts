import User from "../models/users";
import { hashPassword } from "../utils";

export default class AuthService {
  public async createUser(payload: any) {
    const userExists = await User.findOne({ email: payload.email });
    if (userExists) throw { message: "User Already Exists", statusCode: 400 };
    const hashedPassword = await hashPassword(payload.password);
    const user = await User.create({ ...payload, password: hashedPassword });
    return user;
  }
}
