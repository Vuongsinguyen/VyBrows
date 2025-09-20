// Step4Confirmation.tsx - Booking confirmation step
import React, { useState } from 'react';
import type { BookingState } from '../../types/booking';
import { SERVICE_CATEGORIES } from '../UI/BookingComponent';

interface Step4Props {
  booking: BookingState;
  onSubmit: () => void;
  onPrevious: () => void;
  isSubmitting: boolean;
}

const Step4Confirmation: React.FC<Step4Props> = ({
  booking,
  onSubmit,
  onPrevious,
  isSubmitting
}) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const canSubmit = agreedToTerms && agreedToPrivacy && !isSubmitting;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit();
    }
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div 
      role="tabpanel"
      aria-labelledby="step-4-title"
      tabIndex={0}
      className="p-6"
    >
      <h3 id="step-4-title" className="text-xl font-bold mb-6 text-center text-green-800">
        Review & Confirm Booking
      </h3>

      {/* Booking Summary */}
      <div className="mb-8 bg-gradient-to-r from-green-50 to-yellow-50 border border-green-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-green-800 mb-4">Booking Summary</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Service Details */}
          <div>
            <h5 className="font-semibold text-green-700 mb-3">Service Details</h5>
            <div className="space-y-3 text-green-900">
              <div>
                <span className="font-medium">Services:</span>
                <div className="mt-1 space-y-1">
                  {booking.services.map((serviceId, index) => {
                    // Find the service name by ID
                    let serviceName = serviceId;
                    for (const category of SERVICE_CATEGORIES) {
                      for (const group of category.groups) {
                        const service = group.services.find(s => s.id === serviceId);
                        if (service) {
                          serviceName = service.name;
                          break;
                        }
                      }
                    }
                    return (
                      <div key={index} className="flex justify-between text-sm">
                        <span>• {serviceName}</span>
                        <span className="text-green-600">
                          {booking.options[serviceId] && `(${booking.options[serviceId]})`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t border-green-200">
                <span className="font-medium">Category:</span>
                <span className="capitalize">{booking.category}</span>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div>
            <h5 className="font-semibold text-green-700 mb-3">Appointment Details</h5>
            <div className="space-y-2 text-green-900">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{booking.date && formatDate(booking.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Time:</span>
                <span>{booking.time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-8 bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-green-800 mb-4">Personal Information</h4>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Name:</span>
              <span className="text-gray-900">{booking.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="text-gray-900">{booking.email}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Phone:</span>
              <span className="text-gray-900">{booking.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-gray-700">Age:</span>
              <span className="text-gray-900">{booking.age}</span>
            </div>
          </div>
        </div>

        {booking.specialRequests && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="space-y-2">
              <span className="font-medium text-gray-700">Special Requests:</span>
              <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">
                {booking.specialRequests}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Terms and Conditions */}
      <div className="mb-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-yellow-800 mb-4">Terms & Conditions</h4>
                {/* Back Button Step 4 */}
                <button
                  className="buttonBackStep4 mr-4 p-2 rounded-full bg-green-800 text-white border border-green-800 hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                  onClick={() => window.location.href = '/'}
                  aria-label="Back to homepage"
                  type="button"
                  style={{ margin: '16px 0 0 16px' }}
                >
                  <svg width="24" height="24" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
                    <path d="M13.5048 27.3334V19.3334H18.8381V27.3334H25.5048V16.6667H29.5048L16.1715 4.66675L2.83812 16.6667H6.83812V27.3334H13.5048Z" fill="currentColor"/>
                  </svg>
                </button>
        
        <div className="space-y-4">
          {/* Terms Agreement */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="terms-agreement"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
              aria-describedby="terms-help"
            />
            <label htmlFor="terms-agreement" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-medium">I agree to the Terms & Conditions *</span>
              <div className="text-xs text-gray-600 mt-1">
                Including cancellation policy (24-hour notice required), arrival policy (please arrive 10 minutes early), 
                and service guidelines.
              </div>
            </label>
          </div>

          {/* Privacy Policy */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="privacy-agreement"
              checked={agreedToPrivacy}
              onChange={(e) => setAgreedToPrivacy(e.target.checked)}
              className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              required
              aria-describedby="privacy-help"
            />
            <label htmlFor="privacy-agreement" className="text-sm text-gray-700 cursor-pointer">
              <span className="font-medium">I agree to the Privacy Policy *</span>
              <div className="text-xs text-gray-600 mt-1">
                Your personal information will be used only for appointment scheduling and service delivery.
              </div>
            </label>
          </div>
        </div>

        <div id="terms-help" className="sr-only">
          Please review and accept our terms and conditions to proceed with booking
        </div>
        <div id="privacy-help" className="sr-only">
          Please review and accept our privacy policy regarding how we handle your personal information
        </div>
      </div>

      {/* Important Notes */}
      <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-bold text-blue-800 mb-2">Important Notes:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• A confirmation email will be sent to {booking.email}</li>
          <li>• Please arrive 10 minutes before your appointment time</li>
          <li>• Cancellations require 24-hour advance notice</li>
          <li>• Bring a valid ID for age verification</li>
          <li>• Contact us at (555) 123-4567 if you need to reschedule</li>
        </ul>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          onClick={onPrevious}
          type="button"
          disabled={isSubmitting}
        >
          Previous: Personal Info
        </button>
        
        <button
          className={`px-8 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            canSubmit
              ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={handleSubmit}
          type="button"
          disabled={!canSubmit}
          aria-describedby="submit-help"
        >
          {isSubmitting ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Submitting...</span>
            </div>
          ) : (
            'Confirm Booking'
          )}
        </button>
      </div>
      
      <div id="submit-help" className="sr-only">
        Submit your booking request. You will receive a confirmation email upon successful submission.
      </div>

      {/* Validation Messages */}
      {!agreedToTerms || !agreedToPrivacy ? (
        <div className="mt-4 text-center">
          <div className="text-sm text-red-600 font-medium">
            Please accept both Terms & Conditions and Privacy Policy to proceed
          </div>
        </div>
      ) : (
        <div className="mt-4 text-center">
          <div className="text-sm text-green-600 font-medium">
            ✓ Ready to submit your booking!
          </div>
        </div>
      )}
    </div>
  );
};

export default Step4Confirmation;