# Ignite Ticketing

A React-based ticketing and donation platform for Ignite Events.

## Architecture

- **Frontend**: React + Vite + TailwindCSS (deployed on Vercel)
- **Backend**: Separate Node.js API on `ignite-pay-backend` repo (deployed on Render)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
VITE_API_URL=https://your-render-backend-url.onrender.com
```

3. Run development server:
```bash
npm run dev
```

## Deployment

This project is configured to deploy to Vercel automatically.

### Vercel Environment Variables

Make sure to set in Vercel dashboard:
- `VITE_API_URL`: Your Render backend URL (e.g., `https://ignite-pay-backend.onrender.com`)

### Vercel Configuration

The `vercel.json` is configured to:
- Build the React app
- Handle client-side routing (all routes redirect to `index.html`)
- Serve static assets from `dist`

## Project Structure

```
ignite-ticketing/
├── src/
│   ├── pages/        # CheckoutPage, SuccessPage, CancelPage
│   ├── components/
│   └── App.jsx
├── package.json
└── vercel.json       # Vercel deployment config
```

For detailed documentation, see `devguide.md`.
