import { Request, Response } from "express";
import BookingService from "../services/booking.services";
import BaseController from "./base.controller";
// import { bookingSchema } from "../middlewares/validate.schema";

export class BookingController extends BaseController {
  private bookingService: BookingService;

  constructor() {
    super();
    this.bookingService = new BookingService();
  }

  public createBookings = async (req: Request, res: Response) => {
    if (!(req as any).user || !(req as any).user._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const booking = await this.bookingService.createBooking(
      (req as any).user._id,
      req.body
    );
  };

   public getUserBookings = async (req: Request, res: Response) => {
      if (!(req as any).user || !(req as any).user._id) {
         return res.status(401).json({ message: "Unauthorized" });
      }
   
      const bookings = await this.bookingService.getUserBookings(
         (req as any).user._id
      );
      return res.status(200).json({ bookings });
   

   }

   public getAllBookings = async (req: Request, res: Response) => {
      if (!(req as any).user || !(req as any).user._id) {
         return res.status(401).json({ message: "Unauthorized" });
      }
   
      const bookings = await this.bookingService.getAllBookings();
      return res.status(200).json({ bookings });
   }

   public cancelBooking = async (req: Request, res: Response) => {
      if (!(req as any).user || !(req as any).user._id) {
         return res.status(401).json({ message: "Unauthorized" });
      }
   
      const booking = await this.bookingService.cancelBooking(
         (req as any).user._id,
         req.body.bookingId
      );
      return res.status(200).json({ booking });
   }
   
}