import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createCheckoutSession } from './routes/checkout';
import { handleWebhook } from './routes/webhook';
import { healthCheck } from './routes/health';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Stripe webhook endpoint needs raw body
app.use('/api/webhook', express.raw({ type: 'application/json' }));

// Routes
app.post('/api/create-checkout-session', createCheckoutSession);
app.post('/api/webhook', handleWebhook);
app.get('/api/health', healthCheck);

// Local development server
if (require.main === module) {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
