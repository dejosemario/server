import { get } from "http";
import User from "../models/users";
import { hashPassword, comparePassword, generateToken } from "../utils";

export default class AuthService {
  async getUserByEmail(email: string) {
    const user = await User.findOne({ email });

    if (user) {
      return user;
    }
    return null;
  }

  public async createUser(payload: any) {
    const userExists = await this.getUserByEmail(payload.email);
    if (userExists) throw { message: "User Already Exists", statusCode: 400 };
    const hashedPassword = await hashPassword(payload.password);
    const user = await User.create({ ...payload, password: hashedPassword });
    return user;
  }

  public async login(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) throw { message: "User not found", statusCode: 404 };
    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword)
      throw { message: "Invalid credentials", statusCode: 403 };
    const token = generateToken({ id: user.id, firstName: user.name });
    return { token, user };
  }
}
