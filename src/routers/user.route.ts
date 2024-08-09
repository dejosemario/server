import express, { Router } from "express";
import { wrapper } from "../utils";
import isAuthenticated from "../middlewares/auth";
import UserController from "../controllers/user.controller";

class UserRoutes {
  router = express.Router();
  UserController = new UserController();
  path="/user";

  constructor() {
    this.initailizeRoutes();
  }

  private initailizeRoutes() {
    this.router.get(
      `${this.path}/me`,
      isAuthenticated,
      wrapper(this.UserController.getUser.bind(this.UserController))
    );
  }
}

const userRoutes = new UserRoutes();

export default userRoutes;
