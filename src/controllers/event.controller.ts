import { Request, Response } from "express";
import EventService from "../services/event.service";
import BaseController from "./base.controller";
import { eventSchema, updateEventSchema } from "../middlewares/validate.schema";

export class EventController extends BaseController {
  private eventService: EventService;

  constructor() {
    super();
    this.eventService = new EventService();
  }

  public createEvent = async (req: Request, res: Response) => {
    const error = this.validate(eventSchema, req.body);
    if (error) {
      const errorMessage =
        error.details && error.details.length > 0
          ? error.details[0].message
          : "Validation error";
      return this.error(res, 400, errorMessage);
    }

    // Ensure user ID is present
    const userId = (req as any).user?._id;
    if (!userId) {
      return this.error(res, 401, "u"); // Handle unauthorized access
    }
    // Create event data with the logged-in user's ID
    const eventData = { ...req.body, creator: userId };

    const data = await this.eventService.createEvent(eventData);
    if (eventData) return this.success(res, 201, "Event created", data);
    this.error(res, 500, "Internal Error");
  };

  ///create get events by the creator
  public getEventsByCreator = async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) {
      return this.error(res, 401, "Unauthorized"); // Handle unauthorized access
    }
    const data = await this.eventService.getEventsByCreator(userId);
    if (data) return this.success(res, 200, "Events fetched", data);
    this.error(res, 500, "Internal Error");
  };

  public getEvents = async (req: Request, res: Response) => {
    const searchText = req?.query.searchText as string | undefined;
    const date = req?.query.date as string | undefined;

    // Convert date to Date objects
    const start = date ? new Date(date) : undefined;

    const filters = { searchText, date: start };
    const data = await this.eventService.getAllEvents(filters);
    if (data) return this.success(res, 200, "Events fetched", data);
    this.error(res, 500, "Internal Error");
  };

  public getEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    //authenictate user to be sure he is the creator of the event
    const userId = (req as any).user?.id;
    const data = await this.eventService.getEventById(id);
    if (data) return this.success(res, 200, "Event fetched", data);
    this.error(res, 404, "Event not found");
  };

  public updateEvent = async (req: Request, res: Response) => {
    const { id } = req?.params;
    const { _id, createdAt, updatedAt, __v, ...updatedData } = req.body;
    const error = this.validate(updateEventSchema, updatedData);
    if (error) {
      return this.error(res, 400, error);
    }
    const data = await this.eventService.updateEvent(id, updatedData);
    if (data) return this.success(res, 200, "Event updated", data);
    this.error(res, 500, "Internal Error");
  };

  public deleteEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.eventService.deleteEvent(id);
    if (data) return this.success(res, 200, "Event deleted", data);
    this.error(res, 500, "Internal Error");
  };
}
