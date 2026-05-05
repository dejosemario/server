import User from "../models/users.model";
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
        if (userExists)
            throw { message: "User Already Exists", statusCode: 400 };
        const hashedPassword = await hashPassword(payload.password);
        const user = await User.create({
            ...payload,
            password: hashedPassword,
        });
        return user;
    }

    public async login(email: string, password: string) {
        const user = await this.getUserByEmail(email);
        const dummyHash = "$2b$10$invalidhashfortimingprotection";
        const isValidPassword = await comparePassword(
            password,
            user?.password ?? dummyHash,
        );
        if (!user || !isValidPassword) {
            throw Object.assign(new Error("invalid credentials"), {
                statusCode: 401,
            });
        }

        const { password: _, ...safeUser } = user.toJSON();
        const token = generateToken({ id: user._id, name: user.name });
        return { token, user: safeUser };
    }

    public async refreshToken(refreshToken: string) {
        return refreshToken;
    }
}
