import express, { Router } from 'express';
import  {wrapper } from '../utils'




class UserRoutes{
     router = express.Router();

    constructor(){
        this.initailizeRoutes();
    }
    
    private initailizeRoutes(){

        // this.router.get('/',wrapper(this.urlController.))
    }

}

const userRoutes = new UserRoutes();

export default userRoutes;