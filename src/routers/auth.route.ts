import express from "express";
import { wrapper } from "../utils";
import { AuthController } from "../controllers/auth.controller";
import { cacheMiddleware } from "../middlewares/auth";

class AuthRoutes {
  // Create an instance of AuthController
  router = express.Router();
  AuthController = new AuthController();
  path = "/auth";

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/register`, 
      wrapper(this.AuthController.register.bind(this.AuthController))
    );
    this.router.post(
      `${this.path}/login`,
      wrapper(this.AuthController.login.bind(this.AuthController))
    );
    this.router.post(
      `${this.path}/refresh-token`,cacheMiddleware,
      wrapper(this.AuthController.refreshToken.bind(this.AuthController))
    );
    this.router.post(
      `${this.path}/logout`,
      wrapper(this.AuthController.logout.bind(this.AuthController))
    );
  }
}

const authRoutes = new AuthRoutes();

export default authRoutes;
