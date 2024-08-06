import { Request, Response } from "express";
import  AuthService from "../services/auth.service";
import BaseController from "./base.controller";
import { registerSchema } from "../middlewares/validate.schema";


export class AuthController extends BaseController{
    private authService: AuthService;
    constructor(){
        super();
        this.authService = new AuthService();
    }
    
    static async register = async (req: Request, res: Response) => {
       const error = this.validate(registerSchema, req.body);
       if(error){
           return res.status(400).json({success: false, message: error});
       }
       
    const data = await this.authService.createUser(req.body);
    if (data) return this.success(res,200, 'User created', data);
    this.error(res, error.message || 'Internal Error', error.statusCode || 500);
    };
}


