import express, { Router } from "express";
import { wrapper } from "../utils";
import isAuthenticated, { cacheMiddleware, isAuthUser } from "../middlewares/auth";
import UserController from "../controllers/user.controller";

class UserRoutes {
  router = express.Router();
  UserController = new UserController();
  path = "/user";

  constructor() {
    this.initailizeRoutes();
  }

  private initailizeRoutes() {
    this.router.get(
      `${this.path}/me`,
      cacheMiddleware,
      isAuthenticated,
      wrapper(this.UserController.getUser.bind(this.UserController))
    );

    this.router.patch(
      `${this.path}/update-role`,
      isAuthenticated,
      wrapper(this.UserController.updateUserRole.bind(this.UserController))
    );
    this.router.get(
      `${this.path}/attendees`,
      isAuthUser,
      wrapper(this.UserController.getAllAttendees.bind(this.UserController))
    );
  }
}

const userRoutes = new UserRoutes();

export default userRoutes;
