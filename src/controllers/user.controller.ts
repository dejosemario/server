import BaseController from "./base.controller";
import UserService from "../services/user.service";

export default class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getUser(req: Request, res: Response): Promise<any> {
    const userId = (req as any).user.id;
    const data = await this.userService.findById(userId);
    if (!data) return this.error(res, 404, "Can not retrieve User");
    return this.success(res, 200, "User fetched successfully", data);
  }
}