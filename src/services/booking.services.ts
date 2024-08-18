import BookingModel from "../models/bookings.model";
import EventModel from "../models/events.model";
// import UserModel from "../models/users.model";
import { ObjectId } from "mongoose";

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
    console.log(userId, " I am the user id")
    const bookings = await BookingModel.find({ user: userId })
      .populate("event")
      .sort({ createdAt: -1 });
    console.log(bookings, " I am the boking")
    return bookings
  }

  public async getAllBookings() {
    const bookings = await BookingModel.find().populate("event").populate("user").sort({ createdAt: -1 });
    console.log(bookings, " ai I am all the bookings ")
    return bookings;
  }

    public async cancelBooking(user: ObjectId, bookingId: ObjectId) {
        const booking = console.log("emeka")
    }

}

export default BookingService;
