/**
 * PRODUCTION CONFIGURATION
 * 
 * ⚠️ IMPORTANT: These are the PRODUCTION URLs
 * If you need to change them, change them HERE, not scattered in files
 */

export const CONFIG = {
  // Backend API URL (Render)
  API_URL: import.meta.env.VITE_API_URL || 'https://ignite-pay-backend.onrender.com',
  
  // Stripe Publishable Key
  STRIPE_PUBLISHABLE_KEY: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_PLACEHOLDER',
};

// Log config on startup (helps debugging)
console.log('🔧 CONFIG:', CONFIG);

