import { useState } from 'react';
import StripeTrustmark from '../components/StripeTrustmark';

// Backend API URL - change based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CheckoutPage = () => {
  const [donationAmount, setDonationAmount] = useState(25); // Min $25
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleTicketPurchase = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'brosandbrews',
          amount: 2500, // $25 in cents
          metadata: {
            type: 'ticket',
            eventName: 'Bros & Brews - A Night of Impact',
            region: 'DMV',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonation = async () => {
    if (donationAmount < 25) {
      setError('Minimum donation is $25');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/checkout/session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'brosandbrews',
          amount: donationAmount * 100, // Convert dollars to cents
          metadata: {
            type: 'donation',
            eventName: 'Bros & Brews - A Night of Impact',
            region: 'DMV',
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const data = await response.json();
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🍻</div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Bros & Brews
          </h1>
          <h2 className="text-2xl md:text-3xl text-blue-200 mb-8">
            A Night of Impact
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Supporting F3 Nation's Accelerate Campaign • Plant • Grow • Serve
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-4xl mx-auto mb-8">
            <div className="bg-red-500 text-white px-6 py-4 rounded-lg text-center">
              {error}
            </div>
          </div>
        )}

        {/* Ticket Block */}
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Fixed Ticket */}
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="text-4xl mb-4">🎟️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Event Ticket</h3>
              <div className="text-4xl font-bold text-cyan-500 mb-6">$25</div>
              <p className="text-gray-600 mb-8">
                October 23 • Port City Brewing • 6-9 PM
              </p>
              <button
                onClick={handleTicketPurchase}
                disabled={isLoading}
                className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-400 text-black font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {isLoading ? 'Processing...' : 'Get Ticket'}
              </button>
            </div>

            {/* Donation */}
            <div className="bg-white rounded-lg shadow-xl p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Give More</h3>
              <div className="mb-6">
                <label htmlFor="donation-amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    id="donation-amount"
                    type="number"
                    min="25"
                    step="5"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(Number(e.target.value))}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-center text-lg"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">Minimum: $25</p>
              </div>
              <p className="text-gray-600 mb-8">
                100% goes to F3 Nation's Accelerate Campaign
              </p>
              <button
                onClick={handleDonation}
                disabled={isLoading || donationAmount < 25}
                className="w-full bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors"
              >
                {isLoading ? 'Processing...' : 'Give Now'}
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 text-center">
            <h3 className="text-xl font-bold text-white mb-4">Trust & Transparency</h3>
            <p className="text-blue-100 text-sm">
              High Impact Events is an independent events hub. Proceeds from select events are donated to highlighted causes. 
              Tickets are not tax-deductible donations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <StripeTrustmark />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
