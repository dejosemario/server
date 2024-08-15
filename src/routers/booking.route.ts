import express from 'express';
import {wrapper} from "../utils";
import isAuthenticated from '../middlewares/auth';
import {BookingController} from '../controllers/booking.controller';

class BookingRoutes{

    router = express.Router();
    BookingController = new BookingController();
    path= "/bookings";
    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(
            `${this.path}/create-booking`,
            isAuthenticated,
            wrapper(this.BookingController.createBookings.bind(this.BookingController))
        )
        this.router.get(
            `${this.path}/get-user-bookings`,
            isAuthenticated,
            wrapper(this.BookingController.getUserBookings.bind(this.BookingController))
        )
        this.router.get(
            `${this.path}/get-all-bookings`,
            isAuthenticated,
            wrapper(this.BookingController.getAllBookings.bind(this.BookingController))
        ),
        this.router.post(
            `${this.path}/cancel-booking`,
            isAuthenticated,
            wrapper(this.BookingController.getUserBookings.bind(this.BookingController))
        )
        
        
    }


}

const bookingRoutes = new BookingRoutes();

export default bookingRoutes;
