import authRoutes from "./auth.route";
import userRoutes from "./user.route";

const routes  = [authRoutes.router, userRoutes.router];

export default routes;

