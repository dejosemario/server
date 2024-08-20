import BookingModel from "../models/bookings.model";
import EventModel from "../models/events.model";
// import UserModel from "../models/users.model";
import { ObjectId } from "mongoose";
import axios from "axios";
import { storage } from "firebase-admin";
import { Buffer } from "buffer";
import { bucket } from "../config/firebase.config";

class BookingService {
  public async createBooking(user: ObjectId, bookingData: any) {
    bookingData.user = user;

    // Create booking
    const booking = await BookingModel.create(bookingData);

    // Update event tickets
    const event = await EventModel.findById(bookingData.event);
    if (!event) {
      throw new Error("Event not found");
    }
    const ticketTypes = event.ticketTypes;
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

    // // Send email
    // const userObj = await UserModel.findById(user);
    // if (!userObj) {
    //   throw new Error("User not found");
    // }
    // const emailPayload = {
    //   email: userObj.email,
    //   subject: "Booking Confirmation - Eventful",
    //   text: `You have successfully booked ${bookingData.ticketsCount} ticket(s) for ${event.name}.`,
    //   html: "",
    // };

    // await sendEmail(emailPayload);

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
  }

  public async cancelBooking(user: ObjectId, bookingId: ObjectId) {
    const booking = console.log("emeka");
  }

  public QRCode = async (user_id: string, bookingId: string) => {
    try {
      const booking = await BookingModel.findById(bookingId)
        .populate("event")
        .populate("user");

      if (!booking) {
        throw new Error("Booking not found");
      }
      
      if (booking.user && booking.user.toString() !== user_id) {
        throw new Error("You do not have permission to perform this action");
      }

      const event = booking.event as any;
      if (!event) {
        throw new Error("Event not found");
      }

      const expirationTime = new Date(
        event.startTime.getTime() + 12 * 60 * 60 * 1000
      );

      // Generate QR code URL
      const qrCodeUrl = await this.generateQRCode(
        `http://yourapp.com/bookings/${bookingId}`,
        expirationTime
      );

      // Update booking with QR code information
      booking.qrCode = {
        url: qrCodeUrl,
      };
      await booking.save();
    } catch (error) {
      throw new Error("Booking not found");
    }
  };

  private async generateQRCode(url: string, eventStartTime: Date) {
    try {
      const qr = await axios.get("http://api.qrserver.com/v1/create-qr-code", {
        responseType: "arraybuffer",
        params: {
          data: url,
          size: "150x150",
          format: "svg",
          qzone: 2,
          color: "50-15-0",
        },
      });

      const qrBuffer = Buffer.from(qr.data);

      const fileName = `qrcodes/${Date.now()}.svg`;

      // Upload QR code to Firebase Storage
      const file = bucket.file(fileName);

      await file.save(qrBuffer, {
        contentType: "image/svg+xml",
        public: true,
      });

      // Calculate expiration time for the signed URL
      const expirationTime = new Date(eventStartTime);
      expirationTime.setHours(expirationTime.getHours() + 12);

      // Generate a signed URL for the uploaded file
      const [signedUrl] = await file.getSignedUrl({
        action: "read",
        expires: expirationTime,
      });

      // Return the signed URL as a string
      return signedUrl;
    } catch (error: any) {
      throw new Error(`Error generating QR code: ${error.message}`);
    }
  }
}

export default BookingService;
