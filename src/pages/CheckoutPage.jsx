import { useState, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from '@stripe/react-stripe-js';
import StripeTrustmark from '../components/StripeTrustmark';
import { CONFIG } from '../config';

// Load Stripe with your publishable key
const stripePromise = loadStripe(CONFIG.STRIPE_PUBLISHABLE_KEY);

const CheckoutPage = () => {
  const [showCheckout, setShowCheckout] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Adam Cole',
    email: 'adam@gmail.com',
    paxName: 'Anchorman',
    ao: 'Patriot',
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.email) {
      setError('Please fill in all required fields');
      return;
    }
    
    setError(null);
    setShowCheckout(true);
  };

  // Fetch client secret from backend
  const fetchClientSecret = useCallback(async () => {
    console.log('🔵 API_URL:', CONFIG.API_URL);
    console.log('🔵 Fetching checkout session...');
    
    try {
      const response = await fetch(`${CONFIG.API_URL}/api/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'brosandbrews',
          amount: 2500,
          metadata: {
            type: 'ticket',
            eventName: 'Bros & Brews - A Night of Impact',
            region: 'DMV',
            name: formData.name,
            email: formData.email,
            paxName: formData.paxName || formData.name,
            ao: formData.ao,
          }
        }),
      });

      console.log('🔵 Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔴 Response error:', errorText);
        throw new Error(`Backend error: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('🟢 Session created:', data);
      
      // Stripe expects just the string, not an object
      return data.clientSecret || data.client_secret;
    } catch (error) {
      console.error('🔴 Error creating checkout session:', error);
      console.error('🔴 Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      setError(`Cannot connect to payment server. API URL: ${CONFIG.API_URL}. Error: ${error.message}`);
      setShowCheckout(false);
      throw error;
    }
  }, [formData]);

  const options = { fetchClientSecret };

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <button
              onClick={() => setShowCheckout(false)}
              className="text-sm text-cyan-600 hover:text-cyan-700 mb-4 inline-flex items-center gap-1"
            >
              ← Back to details
            </button>
            <div className="text-4xl mb-3">🍻</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Complete Your Payment
            </h1>
            <div className="bg-white rounded-lg shadow-sm p-3 inline-block">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">{formData.name}</span> • {formData.email}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Embedded Checkout */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={options}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>

          {/* Trust Message */}
          <div className="mt-6 text-center">
            <StripeTrustmark />
            <p className="text-xs text-gray-500 mt-4">
              Your payment is encrypted and secure
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Debug Info */}
        <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-2 rounded text-xs">
          🔧 API: {CONFIG.API_URL || 'NOT SET'}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🍻</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              You're going to have a great time at Bros & Brews!
            </h1>
            <p className="text-gray-600">
              Please fill out your details and Stripe will securely process your payment.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="John Smith"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="john@example.com"
              />
            </div>

            {/* PAX Name (Optional) */}
            <div>
              <label htmlFor="paxName" className="block text-sm font-semibold text-gray-700 mb-2">
                F3 PAX Name <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="paxName"
                name="paxName"
                value={formData.paxName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="e.g., Maverick"
              />
            </div>

            {/* AO (Optional) */}
            <div>
              <label htmlFor="ao" className="block text-sm font-semibold text-gray-700 mb-2">
                Your AO <span className="text-gray-400 text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="ao"
                name="ao"
                value={formData.ao}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition"
                placeholder="e.g., The Point"
              />
            </div>

            {/* Ticket Price Info */}
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Event Ticket</span>
                <span className="text-2xl font-bold text-cyan-600">$25</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                October 23 • Port City Brewing • 6-9 PM
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
            >
              Continue to Payment
            </button>
          </form>

          {/* Powered by Stripe */}
          <div className="mt-8">
            <StripeTrustmark />
          </div>

          {/* Trust Message */}
          <p className="text-center text-xs text-gray-500 mt-6">
            Your payment information is encrypted and processed securely by Stripe. We never see or store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
