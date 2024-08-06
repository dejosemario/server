import express from 'express';
import { wrapper } from '../utils';
import { AuthController}  from '../controllers/auth.controller.js';


class AuthRoutes{
    router = express.Router();
    constructor(){
        this.initializeRoutes();
    }

    private initializeRoutes(){
        this.router.post('/register', wrapper(AuthController.register));
        this.router.post('/login', wrapper(AuthController.login));
    }
}

