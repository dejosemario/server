import Event, { EventDocument } from "../models/events.model";

export default class EventService {
  public async findEvent(query: any): Promise<EventDocument | null> {
    try {
      // Find one event that matches the query criteria
      return await Event.findOne(query).exec();
    } catch (error) {
      // Handle any potential errors
      console.error("Error finding event:", error);
      throw new Error("Unable to find event");
    }
  }

  public async createEvent(eventData: any) {
    const newEvent = new Event(eventData);
    await newEvent.save();
    return newEvent;
  }

  public async getAllEvents() {
    const events = await Event.find();
    return events;
  }

  public async getEvent(eventId: string) {
    const event = await Event.findById(eventId);

    if (!event) throw { message: "Event not found", statusCode: 404 };
    return event;
  }

  public async updateEvent(eventId: string, event: any) {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, event, {
      new: true,
    });
    if (!updatedEvent) throw { message: "Event not found", statusCode: 404 };
    return updatedEvent;
  }

  public async deleteEvent(eventId: string) {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) throw { message: "Event not found", statusCode: 404 };
    return deletedEvent;
  }
}
