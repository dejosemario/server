import { Request, Response } from "express";
import PaymentService from "../services/payment.service";

import BaseController from "./base.controller";

export class PaymentController extends BaseController {
  private paymentService: PaymentService;

  constructor() {
    super();
    this.paymentService = new PaymentService();
  }

  public clientSecret = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    const { amount } = req.body;
    // Validate request body
    if (typeof amount !== "number" || amount <= 0) {
      return this.error(res, 400, "Valid amount is required");
    }
    const paymentIntent = await this.paymentService.clientSecret(amount);
    return this.success(res, 200, "Client secret created", {
      clientSecret: paymentIntent.client_secret,
    });
  };
}
