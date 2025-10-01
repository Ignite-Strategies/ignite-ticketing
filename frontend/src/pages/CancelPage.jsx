import { Link } from 'react-router-dom';

const CancelPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-red-800 to-red-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Cancel Icon */}
          <div className="text-8xl mb-8">❌</div>
          
          {/* Cancel Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Checkout Canceled
          </h1>
          
          <p className="text-xl text-red-200 mb-8">
            Your checkout was canceled. No charges were made to your account.
          </p>

          {/* Try Again Section */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to Try Again?</h2>
            <p className="text-red-100 mb-6">
              Don't worry, you can always come back and complete your purchase.
            </p>
            <Link
              to="/"
              className="inline-block bg-white text-red-800 font-bold py-3 px-8 rounded-lg hover:bg-red-100 transition-colors"
            >
              Return to Ticketing
            </Link>
          </div>

          {/* Help Section */}
          <div className="text-sm text-red-300">
            <p>
              Having trouble with checkout? Please contact us for assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
