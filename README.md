# Ignite Ticketing - Frontend

A React-based ticketing and donation platform for Ignite Events.

## Architecture

- **Frontend**: React + Vite + TailwindCSS (deployed on Vercel)
- **Backend**: Separate Node.js API on `ignite-pay-backend` repo (deployed on Render)

## Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file in the `frontend` directory:
```bash
VITE_API_URL=https://your-render-backend-url.onrender.com
```

3. Run development server:
```bash
npm run dev
```

## Deployment

This project is configured to deploy the frontend to Vercel automatically.

### Vercel Environment Variables

Make sure to set in Vercel dashboard:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://ignite-pay-backend.onrender.com`)

### Vercel Configuration

The `vercel.json` is configured to:
- Build the React app from the `frontend/` directory
- Handle client-side routing (all routes redirect to `index.html`)
- Serve static assets from `frontend/dist`

## Project Structure

```
ignite-ticketing/
├── frontend/          # React application
│   ├── src/
│   │   ├── pages/    # CheckoutPage, SuccessPage, CancelPage
│   │   ├── components/
│   │   └── App.jsx
│   └── package.json
├── backend/          # [DEPRECATED - DO NOT USE]
└── vercel.json       # Vercel deployment config
```

**Note**: The `backend/` folder is deprecated. Use the separate `ignite-pay-backend` repository instead.
