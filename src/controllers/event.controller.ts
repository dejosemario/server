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
    const userId = (req as any).user?.id;
    if (!userId) {
      return this.error(res, 401, "Unauthorized"); // Handle unauthorized access
    }

    // Create event data with the logged-in user's ID
    const eventData = { ...req.body, creator: userId };

    // Check for duplicate event
    const existingEvent = await this.eventService.findEvent({
      title: eventData.title,
      startDate: eventData.startDate,
      location: eventData.location,
    });

    if (existingEvent) {
      return this.error(
        res,
        400,
        "Event already exists with the same title, date, and location."
      );
    }

    const data = await this.eventService.createEvent(eventData);
    if (data) return this.success(res, 201, "Event created", data);
    this.error(res, 500, "Internal Error");
  };

  public getEvents = async (req: Request, res: Response) => {
    const data = await this.eventService.getAllEvents();
    if (data) return this.success(res, 200, "Events fetched", data);
    this.error(res, 500, "Internal Error");
  };

  public getEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.eventService.getEvent(id);
    if (data) return this.success(res, 200, "Event fetched", data);
    this.error(res, 404, "Event not found");
  };

  public updateEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const error = this.validate(updateEventSchema, req.body);
    if (error) {
      return this.error(res, 400, error);
    }

    const data = await this.eventService.updateEvent(id, req.body);
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
