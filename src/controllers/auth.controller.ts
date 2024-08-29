import { Request, Response } from "express";
import AuthService from "../services/auth.service";
import BaseController from "./base.controller";
import { registerSchema, loginSchema } from "../middlewares/validate.schema";

export class AuthController extends BaseController {
  private authService: AuthService;
  private tokenName = process.env.ACCESS_TOKEN_NAME as string;
  constructor() {
    super();
    this.authService = new AuthService();
  }

  public register = async (req: Request, res: Response) => {
    const error = this.validate(registerSchema, req.body);
    if (error) {
      return res.status(400).json({ success: false, message: error });
    }

    const data = await this.authService.createUser(req.body);
    if (data) return this.success(res, 200, "User registered", data);
    this.error(res, error.message || "Internal Error", error.statusCode || 500);
  };

  public login = async (req: Request, res: Response) => {
    const error = this.validate(loginSchema, req.body);
    if (error) return this.error(res, 400, error);
    const { email, password } = req.body;
    const { token, user } = await this.authService.login(email, password);
    if (user) {
      res.cookie(this.tokenName, token, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3600000, // 1 hour
      });
      return this.success(res, 200, "login successful", user);
    }
    this.error(res, error.message || "Internal Error", error.statusCode || 500);
  };

  public refreshToken = async (req: Request, res: Response) => {
    const token = req.cookies[this.tokenName];
    if (!token) return this.error(res, 401, "Unauthorized");
    const newToken = await this.authService.refreshToken(token);
    if (newToken !== undefined && newToken !== null) {
      res.cookie(this.tokenName, newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3600000, // 1 hour
      });
      return this.success(res, 200, "Token refreshed successfully", newToken);
    }
  };

  async logout(req: Request, res: Response): Promise<any> {
    // Clear the HTTP-only cookie
    res.clearCookie(this.tokenName);  
    return this.success(res, 200, "Logged out successfully");
  }
}
