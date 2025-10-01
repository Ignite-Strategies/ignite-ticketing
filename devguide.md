# Developer Guide - Ignite Ticketing

## Architecture Overview

**ignite-ticketing** is a FRONTEND-ONLY React application that communicates with a separate backend API.

- **Frontend (this repo)**: React + Vite + TailwindCSS → Deployed to **Vercel**
- **Backend**: `ignite-pay-backend` repo (Node.js + Express + Stripe) → Deployed to **Render**

> ⚠️ **IMPORTANT**: The `backend/` folder in this repo is **DEPRECATED**. Do NOT use it. The actual backend is in the separate `ignite-pay-backend` repository on Render.

## Local Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies**:
```bash
cd frontend
npm install
```

2. **Create environment file**:
```bash
# In frontend/ directory
cp .env.example .env
```

3. **Configure environment variables** (`frontend/.env`):
```env
# For local development with local backend
VITE_API_URL=http://localhost:3000

# OR for testing against production backend
VITE_API_URL=https://your-render-backend-url.onrender.com
```

4. **Run development server**:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup (for full local testing)

If you need to run the backend locally too:

1. Clone the `ignite-pay-backend` repo
2. Follow its setup instructions
3. Make sure it's running on `http://localhost:3000`
4. Update `VITE_API_URL` in frontend `.env` to point to it

## Deployment to Vercel

### Initial Setup

1. **Connect Repository** to Vercel
   - Go to Vercel dashboard
   - Import the `ignite-ticketing` repository

2. **Configure Build Settings**
   
   Vercel will auto-detect settings from `vercel.json`:
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Framework Preset**: Vite

3. **Set Environment Variables**
   
   In Vercel Dashboard → Settings → Environment Variables:
   ```
   VITE_API_URL=https://your-render-backend-url.onrender.com
   ```
   
   > Replace `your-render-backend-url` with your actual Render backend URL

4. **Deploy**
   - Push to `main` branch for auto-deploy
   - Or manually trigger deployment in Vercel dashboard

### How Vercel Config Works

The `vercel.json` configuration:

```json
{
  "buildCommand": "cd frontend && npm install && npm run build",
  "outputDirectory": "frontend/dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

- **buildCommand**: Builds the React app from the `frontend/` directory
- **outputDirectory**: Serves static files from `frontend/dist`
- **rewrites**: All routes redirect to `index.html` so React Router handles client-side routing

This fixes the 404 errors for routes like `/success`, `/cancel`, etc.

## Backend Configuration (Render)

The `ignite-pay-backend` on Render needs this environment variable:

```
FRONTEND_URL=https://your-vercel-app-url.vercel.app
```

This is used for:
- CORS configuration (allowing frontend to call backend)
- Stripe checkout success/cancel URL redirects

## API Integration

### Endpoints Used

The frontend calls these backend endpoints:

#### 1. Create Checkout Session
```
POST ${VITE_API_URL}/api/checkout/session
```

Request body:
```json
{
  "event": "brosandbrews",
  "amount": 2500,
  "metadata": {
    "type": "ticket",
    "eventName": "Bros & Brews - A Night of Impact",
    "region": "DMV"
  }
}
```

Response:
```json
{
  "url": "https://checkout.stripe.com/...",
  "sessionId": "cs_..."
}
```

#### 2. Verify Session (optional)
```
GET ${VITE_API_URL}/api/checkout/verify/:sessionId
```

#### 3. Health Check
```
GET ${VITE_API_URL}/api/health
```

## Project Structure

```
ignite-ticketing/
├── frontend/                    # React application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── CheckoutPage.jsx  # Main ticket/donation page
│   │   │   ├── SuccessPage.jsx   # Payment success
│   │   │   └── CancelPage.jsx    # Payment cancelled
│   │   ├── components/
│   │   │   └── StripeTrustmark.jsx
│   │   ├── App.jsx               # Router setup
│   │   └── main.tsx              # Entry point
│   ├── package.json
│   └── vite.config.ts
├── backend/                     # ⚠️ DEPRECATED - DO NOT USE
├── vercel.json                  # Vercel deployment config
└── devguide.md                  # This file
```

## Troubleshooting

### 404 Errors on Vercel
✅ **FIXED** - The `vercel.json` now properly handles React Router client-side routing by rewriting all routes to `index.html`.

### CORS Errors
- Verify `FRONTEND_URL` is set correctly in backend (Render)
- Verify `VITE_API_URL` is set correctly in frontend (Vercel)
- Check backend CORS configuration allows your Vercel domain

### API Connection Issues
1. Check the backend is running: Visit `https://your-backend.onrender.com/api/health`
2. Open browser DevTools → Network tab
3. Look for failed API calls
4. Check the request URL matches your `VITE_API_URL`

### Build Failures on Vercel
- Ensure `frontend/package.json` has all dependencies
- Check Vercel build logs for specific errors
- Verify build command works locally: `cd frontend && npm run build`

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] `VITE_API_URL` - Backend API URL from Render

### Backend (Render - in ignite-pay-backend repo)
- [ ] `FRONTEND_URL` - Frontend URL from Vercel
- [ ] `STRIPE_SECRET_KEY` - Stripe secret key
- [ ] `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- [ ] `DATABASE_URL` - Database connection string
- [ ] `NODE_ENV` - Set to `production`

## Testing the Full Flow

1. Visit your Vercel URL
2. Click "Get Ticket" or "Give Now"
3. Should redirect to Stripe Checkout
4. Complete payment (use test card: 4242 4242 4242 4242)
5. Should redirect back to `/success` page

## Common Commands

### Frontend Development
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start dev server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run linter
```

### Deploy to Vercel
```bash
git add .
git commit -m "Your changes"
git push origin main  # Auto-deploys to Vercel
```

## Support

For issues or questions:
- Frontend issues: Check this repo's issues
- Backend/API issues: Check `ignite-pay-backend` repo
- Stripe integration: Check Stripe dashboard logs

