import authRoutes from "./auth.route";
import eventRoutes from "./event.route";
import userRoutes from "./user.route";
import paymentRoutes from "./payment.route";
import bookingRoutes from "./booking.route";

const routes  = [authRoutes.router, userRoutes.router, eventRoutes.router, paymentRoutes.router, bookingRoutes.router];

export default routes;

