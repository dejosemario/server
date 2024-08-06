import express, { Router } from 'express';
import  {wrapper } from '../utils'




class userRoutes{
     userRoute = Router();
    constructor(){
        this.initializeRoutes();
    }
    
    private initailizeRoutes(){

        this.userRoute.get('/',wrapper(this.urlController.))
    }

}