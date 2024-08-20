import BaseController from "./base.controller";
import UserService from "../services/user.service";
import { Request, Response } from "express"; // Import the Request and Response types from "express"
import redisClient from "../integrations/redis";

export default class UserController extends BaseController {
  private userService: UserService;
  private allowedRoles = ["creator", "eventee"];

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getUser(req: Request, res: Response): Promise<any> {
    console.log((req as any).user?._id);
    const userId = (req as any).user?._id;
    console.log(userId);
    const data = await this.userService.findById(userId);
    redisClient.setEx("user", 12 * 60 * 60, JSON.stringify(data));
    if (!data) return this.error(res, 404, "Can not retrieve User");
    return this.success(res, 200, "User fetched successfully", data);
  }

  async updateUserRole(
    req: Request<{}, {}, { role: { role: string } }>,
    res: Response
  ): Promise<any> {
    const {
      role: { role },
    } = req.body;
    const userId = (req as any).user?._id;
    // validate the new role
    const user = await this.userService.findById(userId);

    if (!this.allowedRoles.includes(role)) {
      return this.error(res, 400, "Invalid role provided");
    }

    // Perform role-specific logic or validation
    if (user.role === "eventee" && role !== "creator") {
      return this.error(res, 400, "Invalid role transition");
    }

    const data = await this.userService.updateUserRole(userId, role);
    if (!data) return this.error(res, 400, "Can not update role");
    return this.success(res, 200, "Role updated successfully", data);
  }
}
