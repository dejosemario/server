import mongoose, { Document, Schema } from "mongoose";
import { ticketTypeSchema } from "./events.model";

// Define the BookingDocument interface
export interface BookingDocument extends Document {
    event: mongoose.Types.ObjectId; // Reference to the Event
    user: mongoose.Types.ObjectId; // Reference to the User
    ticketTypes: typeof ticketTypeSchema[];
    ticketsCount: number;
    totalAmount: number;
    paymentId: string;
    status: string;
  }

const bookingSchema = new Schema<BookingDocument>(
    {
      event: {
        type: Schema.Types.ObjectId,
        ref: "Event", // Reference to the Event model
        required: true,
      },
      user: {
        type: Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
      },
      ticketTypes: {
        type: [ticketTypeSchema], // Use the ticketTypeSchema here
        required: false,
        default: [],
      },
      ticketsCount: {
        type: Number,
        required: true,
      },
      totalAmount: {
        type: Number,
        required: true,
      },
      paymentId: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        required: true,
        default: "booked",
      },
    },
    { timestamps: true }
  );

  
const Booking = mongoose.model<BookingDocument>("Booking", bookingSchema);

export default Booking;