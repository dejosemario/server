import authRoutes from "./auth.route";
import eventRoutes from "./event.route";
import userRoutes from "./user.route";

const routes  = [authRoutes.router, userRoutes.router, eventRoutes.router];

export default routes;

