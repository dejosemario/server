import express from 'express';
import {wrapper} from "../utils";
import isAuthenticated from '../middlewares/auth';
import {PaymentController} from '../controllers/payment.controller';


class PaymentRoutes{
    router = express.Router();
    PaymentController = new PaymentController();
    path = "/payment";

    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post(
            `${this.path}/create-client-secret`, isAuthenticated,
            wrapper(this.PaymentController.clientSecret.bind(this.PaymentController))
        );

}
}

const paymentRoutes= new PaymentRoutes();

export default paymentRoutes;