import BaseController from "./base.controller";
import UserService from "../services/user.service";
import { userIdSchema } from "../middlewares/validate.schema";

export default class UserController extends BaseController {
  private userService: UserService;

  constructor() {
    super();
    this.userService = new UserService();
  }

  async getUser(req: Request, res: Response): Promise<any> {
    // const error = this.validate(userIdSchema, { id: (req as any).user.id });
    // if (error) return this.error(res, 400, error);
    const userId = (req as any).user.id;
    const data = await this.userService.findById(userId);
    if (!data) return this.error(res, 404, "Can not retrieve User");
    return this.success(res, 200, "User fetched successfully", data);
  }
}
