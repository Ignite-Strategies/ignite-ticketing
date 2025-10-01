import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

const SuccessPage = () => {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const id = searchParams.get('session_id');
    setSessionId(id);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Icon */}
          <div className="text-8xl mb-8">✅</div>
          
          {/* Thank You Message */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Thank You!
          </h1>
          
          <p className="text-xl text-green-200 mb-8">
            Your payment was successful. We're excited to see you at the event!
          </p>

          {/* Session ID */}
          {sessionId && (
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-8">
              <p className="text-green-100 text-sm">
                Transaction ID: <span className="font-mono">{sessionId}</span>
              </p>
            </div>
          )}

          {/* Event Details Reminder */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Event Details</h2>
            <div className="text-green-100 space-y-2">
              <p><strong>Event:</strong> Brothers & Brews Benefit Night</p>
              <p><strong>Includes:</strong> One Port City brew + entry to the event</p>
              <p><strong>Location:</strong> Check your email for venue details</p>
            </div>
          </div>

          {/* Back to Main Site */}
          <div className="space-y-4">
            <p className="text-green-200">
              Want to learn more about F3 The Capital?
            </p>
            <Link
              to="/brosandbrews"
              className="inline-block bg-white text-green-800 font-bold py-3 px-8 rounded-lg hover:bg-green-100 transition-colors"
            >
              Visit Our Main Site
            </Link>
          </div>

          {/* Additional Info */}
          <div className="mt-12 text-sm text-green-300">
            <p>
              You should receive a confirmation email shortly. 
              If you have any questions, please contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
