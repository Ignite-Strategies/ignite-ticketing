import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const API_URL = 'https://eventscrm-backend.onrender.com/api';

export default function PublicForm() {
  const navigate = useNavigate();
  const { slug } = useParams(); // Get slug from URL
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (slug) {
      loadForm();
    }
  }, [slug]);

  const loadForm = async () => {
    try {
      console.log('🔍 Loading form from:', `${API_URL}/forms/public/${slug}`);
      const response = await fetch(`${API_URL}/forms/public/${slug}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load form: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Form loaded:', data);
      console.log('📋 Fields with options:', data.fields.filter(f => f.options));
      
      // Store orgId and eventId in localStorage for form submission
      if (data.orgId) localStorage.setItem('orgId', data.orgId);
      if (data.eventId) localStorage.setItem('eventId', data.eventId);
      
      setForm(data);
      
      // Initialize formData with empty values for all fields
      const initialData = {};
      data.fields.forEach(field => {
        initialData[field.id] = '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('❌ Error loading form:', error);
      alert('Failed to load form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    form.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    try {
      console.log('📤 Submitting form:', formData);
      const response = await fetch(`${API_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug: form.slug,
          orgId: localStorage.getItem('orgId'),     // ← Voodoo magic
          eventId: localStorage.getItem('eventId'), // ← Voodoo magic
          formData: formData
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      console.log('✅ Form submitted successfully');
      navigate('/success', { state: { formName: form.title } });
    } catch (error) {
      console.error('❌ Error submitting form:', error);
      alert('Failed to submit form. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFieldChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user types
    if (errors[fieldId]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldId];
        return newErrors;
      });
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.id];
    const baseInputClass = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
          />
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className={baseInputClass}
            required={field.required}
          />
        );
      
      case 'textarea':
        return (
          <textarea
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={baseInputClass}
            required={field.required}
          />
        );
      
      case 'select':
        return (
          <select
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className={baseInputClass}
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );
      
      case 'radio':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={opt.value}
                  checked={formData[field.id] === opt.value}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="w-4 h-4 text-cyan-600"
                  required={field.required}
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      
      case 'checkbox':
        return (
          <div className="space-y-2">
            {field.options?.map((opt, i) => (
              <label key={i} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={(formData[field.id] || []).includes(opt.value)}
                  onChange={(e) => {
                    const currentValues = formData[field.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt.value]
                      : currentValues.filter(v => v !== opt.value);
                    handleFieldChange(field.id, newValues);
                  }}
                  className="w-4 h-4 text-cyan-600"
                />
                <span className="text-gray-700">{opt.label}</span>
              </label>
            ))}
          </div>
        );
      
      default:
        return (
          <input
            type="text"
            value={formData[field.id] || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className={baseInputClass}
            required={field.required}
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 text-center max-w-md">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Form Not Found</h1>
          <p className="text-gray-600">This form is not available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner - F3 Capital Style */}
      <div className="bg-gradient-to-r from-red-600 to-black text-white py-16 px-4 shadow-xl">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="text-8xl animate-pulse">💪</div>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
            {form.title}
          </h1>
          {form.description && (
            <p className="text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
              {form.description}
            </p>
          )}
          <div className="mt-6 inline-block bg-white/10 backdrop-blur-sm px-6 py-2 rounded-full">
            <p className="text-sm font-semibold">F3 CAPITAL EVENTS</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-8 pb-12">
        {/* Spacer removed, form comes right after banner */}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8">
          <div className="space-y-6">
            {form.fields.map((field, index) => (
              <div key={field.id || index}>
                <label className="block text-gray-700 font-semibold mb-2">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {renderField(field)}
                {errors[field.id] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.id]}</p>
                )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-8 bg-gradient-to-r from-red-600 to-black hover:from-red-700 hover:to-gray-900 text-white py-4 rounded-lg font-bold text-xl transition disabled:opacity-50 disabled:cursor-not-allowed shadow-2xl transform hover:scale-[1.02]"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                💪 Lock In My Spot
              </span>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm font-medium">
          <p>Powered by <span className="text-red-600 font-bold">F3 CAPITAL</span> Events</p>
        </div>
      </div>
    </div>
  );
}

