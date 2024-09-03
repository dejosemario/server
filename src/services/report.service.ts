import EventModel, { EventDocument } from "../models/events.model";
import BookingModel from "../models/bookings.model";
import bookingRoutes from "../routers/booking.route";

interface ReportResponse {
  totalBookings: number;
  cancelledBookings: number;
  totalTickets: number;
  cancelledTickets: number;
  totalRevenueCollected: number;
  totalRevenueRefunded: number;
  ticketTypesAndThierSales?: {
    name: string;
    ticketsSold: number;
    revenue: number;
  }[];
}

export default class ReportService {
  public async getCreatorReports(
    startDate: string,
    endDate: string,
    eventId: string,
    creatorId: string

  ) {
    let query = {};
    if (!eventId) {
      const events = await EventModel.find({ creator: creatorId }).select("_id");
      const eventIds = events.map((event) => event._id);
      query = { event: { $in: eventIds } };
    } else {
      query = { event: eventId };
    }
    if (startDate && endDate) {
      query = {
        ...query,
        createdAt: {
          $gte: new Date(startDate),
          $lte: new Date(endDate + "T23:59:59.999Z"),
        },
      };
    }

    const bookings = await BookingModel.find(query);

    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;
    const totalTickets = bookings.reduce(
      (acc, booking) => acc + booking.ticketsCount,
      0
    );
    const cancelledTickets = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.ticketsCount, 0);
    const totalRevenueCollected = bookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );
    const totalRevenueRefunded = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const responseObject: ReportResponse = {
      totalBookings,
      cancelledBookings,
      totalTickets,
      cancelledTickets,
      totalRevenueCollected,
      totalRevenueRefunded,
    };

    if (!eventId) {
      return responseObject;
    }

    const event = await EventModel.findById(eventId);
    const ticketTypesInEvent = event?.ticketTypes;

    const ticketTypesAndThierSales: {
      name: string;
      ticketsSold: number;
      revenue: number;
    }[] = [];
    ticketTypesInEvent?.forEach((ticketType: any) => {
      const bookingsWithTicketType = bookings.filter((booking: any) => {
        return booking.ticketType === ticketType.name;
      });
      ticketTypesAndThierSales.push({
        name: ticketType.name,
        ticketsSold:
          bookingsWithTicketType.reduce(
            (acc, booking) => acc + booking.ticketsCount,
            0
          ) || 0,
        revenue:
          bookingsWithTicketType.reduce(
            (acc, booking) => acc + booking.totalAmount,
            0
          ) || 0,
      });
    });
    responseObject.ticketTypesAndThierSales = ticketTypesAndThierSales;
    return responseObject;
  }

  public async getUserReports(userId: string) {
    const bookings = await BookingModel.find({ user: userId });
    const totalBookings = bookings.length;
    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "cancelled"
    ).length;
    const totalTickets = bookings.reduce(
      (acc, booking) => acc + booking.ticketsCount,
      0
    );
    const cancelledTickets = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.ticketsCount, 0);
    const totalAmountSpent = bookings.reduce(
      (acc, booking) => acc + booking.totalAmount,
      0
    );
    const totalAmountReceivedAsRefund = bookings
      .filter((booking) => booking.status === "cancelled")
      .reduce((acc, booking) => acc + booking.totalAmount, 0);

    const responseObject = {
      totalBookings,
      cancelledBookings,
      totalTickets,
      cancelledTickets,
      totalAmountSpent,
      totalAmountReceivedAsRefund,
    };

    return responseObject;
  }
}
