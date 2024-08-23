import express from "express";
import { wrapper } from "../utils";
import isAuthenticated, {
  cacheMiddleware,
  isAuthUser,
} from "../middlewares/auth";
import { BookingController } from "../controllers/booking.controller";

class BookingRoutes {
  router = express.Router();
  BookingController = new BookingController();
  path = "/bookings";
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}/create-booking`,
      isAuthUser,
      wrapper(
        this.BookingController.createBookings.bind(this.BookingController)
      )
    );
    this.router.get(
      `${this.path}/get-user-bookings`,
      isAuthUser,
      wrapper(
        this.BookingController.getUserBookings.bind(this.BookingController)
      )
    );
    this.router.get(
      `${this.path}/get-all-bookings`,
      cacheMiddleware,
      isAuthenticated,
      wrapper(
        this.BookingController.getAllBookings.bind(this.BookingController)
      )
    ),
      this.router.post(
        `${this.path}/cancel-booking`,
        isAuthUser,
        wrapper(
          this.BookingController.cancelBooking.bind(this.BookingController)
        )
      ),
      this.router.post(
        `${this.path}/generate-qrcode`,
        isAuthenticated,
        wrapper(
          this.BookingController.generateQRCode.bind(this.BookingController)
        )
      );
  }
}

const bookingRoutes = new BookingRoutes();

export default bookingRoutes;
