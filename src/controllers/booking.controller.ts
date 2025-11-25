import { Request, Response } from "express";
import BookingService from "../services/booking.services";
import BaseController from "./base.controller";
import redisClient from "../integrations/redis";
// import { bookingSchema } from "../middlewares/validate.schema";

export class BookingController extends BaseController {
  private bookingService: BookingService;

  constructor() {
    super();
    this.bookingService = new BookingService();
  }
  public createBookings = async (req: Request, res: Response) => {
    req.body.user = (req as any).user;
    if (!(req as any).user || !(req as any).user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await this.bookingService.createBooking(
      (req as any).user.id,
      req.body
    );
    return res.status(200).json({ booking });
  };

  public getUserBookings = async (req: Request, res: Response) => {
    req.body.user = (req as any).user;
    if (!(req as any).user || !(req as any).user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const bookings = await this.bookingService.getUserBookings(
      (req as any).user.id
    );
    redisClient.setex("userBooking", 12 * 60 * 60, JSON.stringify(bookings));

    return res.status(200).json({ bookings });
  };

  public getAllBookings = async (req: Request, res: Response) => {
    if (!(req as any).user || !(req as any).user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const bookings = await this.bookingService.getAllBookings();
    redisClient.setex("GetAllBookings", 12 * 60 * 60, JSON.stringify(bookings));
    return res.status(200).json({ bookings });
  };

  public cancelBooking = async (req: Request, res: Response) => {
    const { eventId, ticketTypeName, ticketsCount, bookingId, paymentId } =
      req.body;
    const userId = (req as any).user.id;
    if (!(req as any).user || !(req as any).user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const response = await this.bookingService.cancelBooking(
      eventId,
      ticketTypeName,
      ticketsCount,
      bookingId,
      paymentId,
      userId
    );

    return this.success(res, 200, "Booking cancelled successfuly ");
  };

  public generateQRCode = async (req: Request, res: Response) => {
    if (!(req as any).user || !(req as any).user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const qrCode = await this.bookingService.QRCode(
      (req as any).user.id,
      req.body.bookingId
    );
    return res.status(200).json({ qrCode });
  };
}
