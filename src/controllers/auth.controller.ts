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
        maxAge: 3600000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: "lax",
      });
      return this.success(res, 200, "login successful",  user );
    }
    this.error(res, error.message || "Internal Error", error.statusCode || 500);
  };
}
