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
  const canSubmit = !isSubmitting;

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

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          onClick={onPrevious}
          type="button"
          disabled={isSubmitting}
        >
          Back
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
      <div className="mt-4 text-center">
        <div className="text-sm text-green-600 font-medium">
          ✓ Ready to submit your booking!
        </div>
      </div>
    </div>
  );
};

export default Step4Confirmation;