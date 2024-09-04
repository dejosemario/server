import BookingModel from "../models/bookings.model";
import EventModel from "../models/events.model";
import UserModel from "../models/users.model";
import { ObjectId } from "mongoose";
import axios from "axios";
import sendEmails from "../utils/sendEmail";
import { Buffer } from "buffer";
import { Stripe } from "stripe";
import { bucket } from "../config/firebase.config";
import { config } from "dotenv";
config();

class BookingService {
  private stripe: Stripe;
  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found");
    }
    this.stripe = new Stripe(stripeSecretKey);
  }

  public async createBooking(user: ObjectId, bookingData: any) {
    bookingData.user = user;

    // Create booking
    const booking = await BookingModel.create(bookingData);

    // Update event tickets
    const event = await EventModel.findById(bookingData.event);
    if (!event) {
      throw new Error("Event not found");
    }

    const ticketTypes = event.ticketTypes || [];
    const updatedTicketTypes = ticketTypes?.map((ticketType: any) => {
      if (ticketType.name === bookingData.ticketType) {
        ticketType.booked =
          Number(ticketType.booked ?? 0) + Number(bookingData.ticketsCount);
        ticketType.available =
          Number(ticketType.available ?? ticketType.limit) -
          Number(bookingData.ticketsCount);
      }
      return ticketType;
    });

    await EventModel.findByIdAndUpdate(bookingData.event, {
      ticketTypes: updatedTicketTypes,
    });

    // Send email
    const userObj = await UserModel.findById(user);
    if (!userObj) {
      throw new Error("User not found");
    }
    const emailPayload = {
      email: userObj.email,
      subject: "Booking Confirmation - Eventful",
      text: `You have successfully booked ${bookingData.ticketsCount} ticket(s) for ${event.name}.`,
      html: "",
    };

    await sendEmails(emailPayload);

    return booking;
  }

  public async getUserBookings(userId: ObjectId) {
    const bookings = await BookingModel.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });
    return bookings;
  }

  public async getAllBookings() {
    const bookings = await BookingModel.find()
      .populate("event")
      .populate("user")
      .sort({ createdAt: -1 });
    return bookings;
  }

  public async cancelBooking(
    eventId: ObjectId,
    ticketTypeName: string,
    ticketsCount: number,
    bookingId: ObjectId,
    paymentId: string,
    user: ObjectId
  ) {
    // const refund = await this.stripe.refunds.create({
    //   payment_intent: paymentId,
    // });

    // if (refund.status !== "succeeded") {
    //   throw new Error("Refund failed");
    // }

    const cancelledBooking = await BookingModel.findByIdAndUpdate(bookingId, {
      status: "cancelled",
    });

    if (!cancelledBooking) {
      throw new Error("Booking not found");
    }
    // update event tickets
    const event = await EventModel.findById(eventId);
    const ticketTypes = event?.ticketTypes;
    const updatedTicketTypes = ticketTypes?.map((ticketType: any) => {
      if (ticketType.name === ticketTypeName) {
        ticketType.booked =
          Number(ticketType.booked ?? 0) - Number(ticketsCount);
        ticketType.available =
          Number(ticketType.available ?? ticketType.limit) +
          Number(ticketsCount);
      }
      return ticketType;
    });

    await EventModel.findByIdAndUpdate(eventId, {
      ticketTypes: updatedTicketTypes,
    });

    const userObj = await UserModel.findById(user);
    if (!userObj) {
      throw new Error("User not found");
    }
    const emailPayload = {
      email: userObj.email,
      subject: "Booking Cancellation - SheyEvents",
      text: `You have successfully cancelled your booking for ${event?.name}.`,
      html: ``,
    };

    const response = await sendEmails(emailPayload);
    return response;
  }

  public QRCode = async (user_id: string, bookingId: string) => {
    try {
      const booking = await BookingModel.findById(bookingId)
        .populate("event")
        .populate("user");

      if (!booking) {
        throw new Error("Booking not found");
      }
      if (booking.user && booking.user.id.toString() !== user_id) {
        throw new Error("You do not have permission to perform this action");
      }

      const event = booking.event as any;
      if (!event) {
        throw new Error("Event not found");
      }      

      const eventDateTime = new Date(
        `${event.date.toISOString().split("T")[0]}T${event.time}`
      );
      const expirationTime = new Date(
        eventDateTime.getTime() + 12 * 60 * 60 * 1000
      );


      // Generate QR code URL
      const qrCodeUrl = await this.generateQRCode(
        `https://de-eventful.vercel.app//events/${bookingId}`,
        expirationTime
      );

      // Update booking with QR code information
      booking.qrCode = {
        url: qrCodeUrl,
      };
      await booking.save();
      return qrCodeUrl;
    } catch (error: any) {
      console.error("Error in booking service:", error); // Log the actual error
      throw new Error(
        error?.message || "An error occurred while processing the booking"
      );
    }
  };

  private async generateQRCode(url: string, eventStartTime: Date) {
    try {
      const qr = await axios.get("http://api.qrserver.com/v1/create-qr-code", {
        responseType: "arraybuffer",
        params: {
          data: url,
          size: "300x300",
          format: "svg",
          qzone: 2,
          color: "50-15-0",
        },
      });
  
      const qrBuffer = Buffer.from(qr.data);
      const fileName = `qrcodes/${Date.now()}.svg`;
  
  
      const file = bucket.file(fileName);
  
      await file.save(qrBuffer, {
        contentType: "image/svg+xml",
        public: true,
      });  
  
      const expirationTime = new Date(eventStartTime);
      expirationTime.setHours(expirationTime.getHours() + 12);
  
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: expirationTime,
      });
  
      return signedUrl;
    } catch (error: any) {
      console.error("Error generating QR code:", error);
      throw new Error(`Error generating QR code: ${error.message}`);
    }
  }
  
}

export default BookingService;
