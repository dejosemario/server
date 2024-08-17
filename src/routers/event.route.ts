import express from 'express';
import {wrapper} from "../utils";
import isAuthenticated, { isAuthorized, isAuthUser } from '../middlewares/auth';
import {EventController} from '../controllers/event.controller';


class EventRoutes{
    router = express.Router();
    EventController = new EventController();
    path = "/events";
    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.get(
            `${this.path}/all`,
            wrapper(this.EventController.getEvents.bind(this.EventController))
        );
        this.router.get(
            `${this.path}/creator`,isAuthUser,
            wrapper(this.EventController.getEventsByCreator.bind(this.EventController))
        );
        
        this.router.post(
            `${this.path}/create`,isAuthenticated,
            wrapper(this.EventController.createEvent.bind(this.EventController))
        );
        this.router.put(
            `${this.path}/update/:id`,isAuthenticated,
            wrapper(this.EventController.updateEvent.bind(this.EventController))
        );
        this.router.get(
            `${this.path}/:id`,isAuthenticated, 
            wrapper(this.EventController.getEvent.bind(this.EventController))
        );
        this.router.delete(
            `${this.path}/delete/:id`,isAuthenticated,
            wrapper(this.EventController.deleteEvent.bind(this.EventController))
        );
    }
}

const eventRoutes = new EventRoutes();

export default eventRoutes;