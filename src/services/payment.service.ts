import { Stripe } from "stripe";
import dotenv from "dotenv";
dotenv.config();

export default class PaymentService {
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecretKey) {
      throw new Error("Stripe secret key not found");
    }

    this.stripe = new Stripe(stripeSecretKey);
  }

  public async clientSecret(
    amount: number,
  ): Promise<Stripe.PaymentIntent> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: amount * 100,
      currency: "usd",
      description: "Payment for Eventful Stack Project",
      // automatic_payment_methods: {
      //     enabled: true,
      //   },
      // payment_method_types: ['card'],
      // metadata: {integration_check: 'accept_a_payment'}
    });

    return paymentIntent;
  }
}
