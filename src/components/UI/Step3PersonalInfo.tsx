// Step3PersonalInfo.tsx - Personal information form
import React, { useState } from 'react';
import type { BookingState } from '../../types/booking';
import { SERVICE_CATEGORIES } from '../UI/BookingComponent';

interface Step3Props {
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface ValidationErrors {
  fullName?: string;
  email?: string;
  phone?: string;
}

const Step3PersonalInfo: React.FC<Step3Props> = ({
  booking,
  updateBooking,
  onNext,
  onPrevious
}) => {
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [showValidation, setShowValidation] = useState(false);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Validate all fields
  const validateForm = (): ValidationErrors => {
    const newErrors: ValidationErrors = {};

    if (!booking.fullName?.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (booking.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!booking.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(booking.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!booking.phone?.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(booking.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    return newErrors;
  };

  // Handle input changes with real-time validation
  const handleInputChange = (field: keyof BookingState, value: string | number) => {
    updateBooking({ [field]: value });

    // Clear specific field error when user starts typing
    if (showValidation && errors[field as keyof ValidationErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleNext = () => {
    setShowValidation(true);
    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onNext();
    } else {
      // Focus on first field with error
      const firstErrorField = Object.keys(validationErrors)[0];
      const element = document.getElementById(firstErrorField);
      element?.focus();
    }
  };

  const isFormValid = () => {
    const validationErrors = validateForm();
    return Object.keys(validationErrors).length === 0;
  };

  return (
    <div
      role="tabpanel"
      aria-labelledby="step-3-title"
      tabIndex={0}
      className="p-6"
    >
      <h3 id="step-3-title" className="text-xl font-bold mb-6 text-center text-green-800">
        Personal Information
      </h3>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1330px] mx-auto">
        {/* Left: Personal Info Form (2 columns) */}
        <div className="flex-1 min-w-0">
          <form noValidate className="space-y-6">
            {/* Full Name */}
            <div>
              <label 
                htmlFor="fullName" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={booking.fullName || ''}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  showValidation && errors.fullName 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
                placeholder="Enter your full name"
                aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                aria-invalid={showValidation && !!errors.fullName}
                autoComplete="name"
                required
              />
              {showValidation && errors.fullName && (
                <div id="fullName-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.fullName}
                </div>
              )}
            </div>
            {/* Email */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={booking.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  showValidation && errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
                placeholder="Enter your email address"
                aria-describedby={errors.email ? 'email-error' : undefined}
                aria-invalid={showValidation && !!errors.email}
                autoComplete="email"
                required
              />
              {showValidation && errors.email && (
                <div id="email-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.email}
                </div>
              )}
            </div>
            {/* Phone */}
            <div>
              <label 
                htmlFor="phone" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={booking.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  showValidation && errors.phone 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-green-500'
                }`}
                placeholder="Enter your phone number"
                aria-describedby={errors.phone ? 'phone-error' : undefined}
                aria-invalid={showValidation && !!errors.phone}
                autoComplete="tel"
                required
              />
              {showValidation && errors.phone && (
                <div id="phone-error" className="text-red-600 text-sm mt-1" role="alert">
                  {errors.phone}
                </div>
              )}
            </div>
            {/* Special Requests */}
            <div>
              <label 
                htmlFor="specialRequests" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Special Requests (Optional)
              </label>
              <textarea
                id="specialRequests"
                name="specialRequests"
                value={booking.specialRequests || ''}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-vertical"
                placeholder="Any special requests or preferences..."
                maxLength={500}
              />
            </div>
            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
              <div />
              <button
                className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  isFormValid()
                    ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={handleNext}
                type="button"
                aria-describedby="step-3-help"
              >
                Continue
              </button>
            </div>
            <div id="step-3-help" className="sr-only">
              Proceed to step 4 to review and confirm your booking
            </div>
            {/* Form Status */}
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                {showValidation && Object.keys(errors).length > 0 && (
                  <span className="text-red-600 font-medium">
                    Please fix the errors above to continue
                  </span>
                )}
                {isFormValid() && (
                  <span className="text-green-600 font-medium">
                    ✓ All information looks good!
                  </span>
                )}
              </div>
            </div>
          </form>
        </div>
        {/* Right: Summary Box (1 column) */}
        <div className="md:w-[340px] md:min-w-[300px] md:max-w-[400px] w-full mb-8 md:mb-0 min-w-0">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg sticky md:top-24 flex flex-col gap-4">
            <h4 className="font-semibold text-green-800 mb-2">Booking Summary:</h4>
            <div className="text-green-700 space-y-1 mb-2">
              <div>
                <strong>Services:</strong>
                <ul className="mt-1 ml-4 space-y-1">
                  {booking.services.map((serviceId, index) => {
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
                      <li key={index} className="text-sm">
                        • {serviceName} {booking.options[serviceId] && `(${booking.options[serviceId]})`}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <p><strong>Date:</strong> {booking.date && new Date(booking.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</p>
              <p><strong>Time:</strong> {booking.time}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3PersonalInfo;