import { useLocation } from 'react-router-dom';

const FormSuccess = () => {
  const location = useLocation();
  const formName = location.state?.formName || 'the form';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
        {/* Success Icon */}
        <div className="text-6xl mb-6">✅</div>
        
        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Form Submitted Successfully!
        </h1>
        
        <p className="text-gray-600 mb-6">
          Thank you for submitting {formName}. We've received your information and will be in touch soon!
        </p>

        {/* F3 Capital Branding */}
        <div className="bg-gradient-to-r from-red-600 to-black text-white py-4 px-6 rounded-lg mb-6">
          <p className="text-lg font-bold">F3 CAPITAL</p>
          <p className="text-sm opacity-90">Events</p>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-gray-500">
          You should receive a confirmation email shortly. 
          If you have any questions, please contact us.
        </p>
      </div>
    </div>
  );
};

export default FormSuccess;
