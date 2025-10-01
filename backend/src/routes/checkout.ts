import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

interface CheckoutRequest {
  type: 'ticket' | 'donation';
  amount?: number;
}

export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { type, amount }: CheckoutRequest = req.body;

    if (!type) {
      return res.status(400).json({ error: 'Type is required' });
    }

    let sessionConfig: Stripe.Checkout.SessionCreateParams;

    if (type === 'ticket') {
      // Fixed $25 ticket
      sessionConfig = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Brothers & Brews Benefit Night Ticket',
                description: 'Each ticket includes one Port City brew + entry to the event',
              },
              unit_amount: 2500, // $25.00
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          type: 'ticket',
          amount: '25.00'
        }
      };
    } else if (type === 'donation') {
      // Custom donation amount
      if (!amount || amount < 1) {
        return res.status(400).json({ error: 'Valid donation amount is required' });
      }

      sessionConfig = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Brothers & Brews Benefit Night Donation',
                description: 'Thank you for your generous donation!',
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
        metadata: {
          type: 'donation',
          amount: amount.toString()
        }
      };
    } else {
      return res.status(400).json({ error: 'Invalid type. Must be "ticket" or "donation"' });
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
};
