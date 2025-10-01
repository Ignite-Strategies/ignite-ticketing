import { Request, Response } from 'express';
import Stripe from 'stripe';
import fs from 'fs';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const transaction = {
      id: session.id,
      email: session.customer_details?.email || 'unknown',
      amount: session.amount_total ? session.amount_total / 100 : 0,
      type: session.metadata?.type || 'unknown',
      timestamp: new Date().toISOString(),
      currency: session.currency,
      payment_status: session.payment_status
    };

    // Log to console
    console.log('Transaction completed:', transaction);

    // Write to JSON file (temporary storage until Repo 3)
    const transactionsFile = path.join(process.cwd(), 'transactions.json');
    
    try {
      let transactions = [];
      if (fs.existsSync(transactionsFile)) {
        const data = fs.readFileSync(transactionsFile, 'utf8');
        transactions = JSON.parse(data);
      }
      
      transactions.push(transaction);
      fs.writeFileSync(transactionsFile, JSON.stringify(transactions, null, 2));
    } catch (fileError) {
      console.error('Error writing to transactions file:', fileError);
    }
  }

  res.json({ received: true });
};
