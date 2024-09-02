import User from "../models/users.model";
import BookingModel from "../models/bookings.model";
import EventModel from "../models/events.model";


export default class UserService {
  public async findById(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) throw { message: "User not founddd", statusCode: 404 };
    return user;
  }

  public async updateUserRole(userId: string, newRole: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole },
      { new: true }
    ).select("-password");
    if (!user) throw { message: "User not found", statusCode: 404 };
    return user;
  }

 public async getAllAttendees(creatorId: string) {
  const events = await EventModel.find({ creator: creatorId }).select("_id");

  const eventIds = events.map((event) => event._id);

  const bookings = await BookingModel.find({ event: { $in: eventIds } })
    .populate("user", "id name email") 
    .populate("event", "name") // 
    .select("user createdAt event"); 

    console.log("Bookings: ", bookings);

  // Step 3: Format the results
  const attendees = bookings.map((booking) => ({
    _id: (booking.user as any)._id, 
    name: (booking.user as any).name, 
    email: (booking.user as any).email,
    createdAt: (booking as any).createdAt,
    eventName: (booking.event as any).name,
  }));

  return attendees;
}
}
