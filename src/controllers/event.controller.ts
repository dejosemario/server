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
    try{
        if (data) return this.success(res, 201, "Event created", data);
    }
    catch(error: any){
        console.log('Error:', error);
        error.statusCode = 500; // You can use different status codes based on the error
        error.message = 'Error creating event: ' + error.message;
    }
    
    
  };

  public getEvents = async (req: Request, res: Response) => {
   const searchText = req?.query.searchText as string | undefined;
   const startDate = req?.query.startDate as string | undefined; 
   const endDate = req?.query.endDate as string | undefined

     // Convert startDate and endDate to Date objects
     const start = startDate ? new Date(startDate) : undefined;
     const end = endDate ? new Date(endDate) : undefined;

    const filters = { searchText, startDate: start,
        endDate: end}; 
    const data = await this.eventService.getAllEvents(filters);
    if (data) return this.success(res, 200, "Events fetched", data);
    this.error(res, 500, "Internal Error");
  };

  public getEvent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const data = await this.eventService.getEventById(id);
    if (data) return this.success(res, 200, "Event fetched", data);
    this.error(res, 404, "Event not found");
  };

  public updateEvent = async (req: Request, res: Response) => {
    const { id } = req?.params;
    console.log("I am the id before", req.body);
    const {_id, createdAt, updatedAt, __v, ...updatedData} = req.body;
    console.log("I am the id after", updatedData);
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
