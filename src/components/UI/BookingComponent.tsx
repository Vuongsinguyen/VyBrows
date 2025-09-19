// BookingComponent.tsx - Modern React-based booking system
import React, { useState, useCallback, useEffect } from 'react';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2DateTime from './Step2DateTime';
import Step3PersonalInfo from './Step3PersonalInfo';
import Step4Confirmation from './Step4Confirmation';
import ServiceModal from './ServiceModal';

// Types
export interface BookingState {
  step: number;
  category: string;
  service: string;
  option: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  email: string;
}

export interface Service {
  name: string;
  price: string;
  options: string[];
}

export interface ServiceGroup {
  title: string;
  services: Service[];
}

export interface ServiceCategory {
  key: string;
  title: string;
  description: string;
  groups: ServiceGroup[];
}

// Sample service data
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'pmu',
    title: 'PMU',
    description: 'Permanent makeup services',
    groups: [
      {
        title: 'Brows',
        services: [
          { name: 'Shading Ombré', price: '$100', options: ['Classic', 'Ombre'] },
          { name: 'Micro Blading', price: '$120', options: ['Micro', 'Nano'] },
          { name: 'Combo Brows', price: '$150', options: ['Natural', 'Bold'] }
        ]
      },
      {
        title: 'Lips',
        services: [
          { name: 'Lip Blush', price: '$90', options: ['Soft', 'Bold'] }
        ]
      }
    ]
  },
  {
    key: 'skincare',
    title: 'Skincare',
    description: 'Professional facial treatments',
    groups: [
      {
        title: 'Facial Treatments',
        services: [
          { name: 'Acne Treatment', price: '$80', options: ['Basic', 'Advanced'] },
          { name: 'Hydra Facial', price: '$120', options: ['Hydrating', 'Brightening'] },
          { name: 'Chemical Peel', price: '$100', options: ['Light', 'Medium'] }
        ]
      }
    ]
  },
  {
    key: 'detox',
    title: 'Detox & Herbal Hair Wash',
    description: 'Natural hair and scalp treatments',
    groups: [
      {
        title: 'Hair Treatments',
        services: [
          { name: 'Herbal Hair Wash', price: '$60', options: ['Herbal', 'Premium'] },
          { name: 'Scalp Detox', price: '$80', options: ['Deep Clean', 'Scalp Massage'] }
        ]
      }
    ]
  }
];

// Step indicator component
const StepIndicator: React.FC<{ step: number; title: string; isActive: boolean; isCompleted: boolean }> = ({
  step,
  title,
  isActive,
  isCompleted
}) => (
  <div
    className={`flex-1 text-center p-3 rounded-lg transition-all duration-300 mx-1 ${
      isActive
        ? 'bg-green-800 text-white transform scale-105'
        : isCompleted
        ? 'bg-green-600 text-white'
        : 'bg-gray-200 text-gray-600'
    }`}
    aria-current={isActive ? 'step' : undefined}
  >
    <div className="font-semibold text-sm md:text-base">
      {step}. {title}
    </div>
    {isActive && (
      <div className="w-full h-1 bg-yellow-400 mt-2 rounded-full"></div>
    )}
  </div>
);

// Main booking component
const BookingComponent: React.FC = () => {
  // Initial booking state
  const [booking, setBooking] = useState<BookingState>({
    step: 1,
    category: 'pmu',
    service: '',
    option: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: ''
  });

  // Modal state
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null
  });

  // Loading and status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  // Update booking state
  const updateBooking = useCallback((updates: Partial<BookingState>) => {
    setBooking(prev => ({ ...prev, ...updates }));
  }, []);

  // Validation functions
  const validateStep = useCallback((step: number): { isValid: boolean; message: string } => {
    switch (step) {
      case 1:
        if (!booking.category || !booking.service || !booking.option) {
          return { isValid: false, message: 'Please select a service and option' };
        }
        break;
      case 2:
        if (!booking.date || !booking.time) {
          return { isValid: false, message: 'Please select date and time' };
        }
        const selectedDate = new Date(booking.date);
        const today = new Date();
        if (selectedDate <= today) {
          return { isValid: false, message: 'Please select a future date' };
        }
        break;
      case 3:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9+\-\s()]{10,15}$/;
        const nameRegex = /^[A-Za-z\s]{2,50}$/;
        
        if (!nameRegex.test(booking.name)) {
          return { isValid: false, message: 'Please enter a valid name (2-50 letters only)' };
        }
        if (!phoneRegex.test(booking.phone)) {
          return { isValid: false, message: 'Please enter a valid phone number (10-15 digits)' };
        }
        if (!emailRegex.test(booking.email)) {
          return { isValid: false, message: 'Please enter a valid email address' };
        }
        break;
    }
    return { isValid: true, message: '' };
  }, [booking]);

  // Navigation functions
  const nextStep = useCallback(() => {
    const validation = validateStep(booking.step);
    if (!validation.isValid) {
      setStatusMessage({ type: 'error', message: validation.message });
      return;
    }
    
    setStatusMessage({ type: '', message: '' });
    if (booking.step < 4) {
      updateBooking({ step: booking.step + 1 });
    }
  }, [booking.step, validateStep, updateBooking]);

  const prevStep = useCallback(() => {
    if (booking.step > 1) {
      setStatusMessage({ type: '', message: '' });
      updateBooking({ step: booking.step - 1 });
    }
  }, [booking.step, updateBooking]);

  // Service selection handlers
  const openServiceModal = useCallback((service: Service) => {
    setModalData({ isOpen: true, service });
  }, []);

  const closeModal = useCallback(() => {
    setModalData({ isOpen: false, service: null });
  }, []);

  const selectServiceOption = useCallback((serviceName: string, option: string) => {
    updateBooking({ service: serviceName, option });
    closeModal();
  }, [updateBooking, closeModal]);

  // Submit booking
  const submitBooking = useCallback(async () => {
    const validation = validateStep(3);
    if (!validation.isValid) {
      setStatusMessage({ type: 'error', message: validation.message });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: '', message: '' });

    try {
      // Simulate API call
      const response = await fetch('/.netlify/functions/submitBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: booking.category,
          service: booking.service,
          option: booking.option,
          date: booking.date,
          time: booking.time,
          name: booking.name,
          phone: booking.phone,
          email: booking.email,
          notes: 'Submitted via React booking system'
        })
      });

      const result = await response.json();

      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: 'Booking submitted successfully! We\'ll contact you within 24 hours.'
        });
        
        // Reset form after 3 seconds
        setTimeout(() => {
          setBooking({
            step: 1,
            category: 'pmu',
            service: '',
            option: '',
            date: '',
            time: '',
            name: '',
            phone: '',
            email: ''
          });
          setStatusMessage({ type: '', message: '' });
        }, 3000);
      } else {
        throw new Error(result.error || 'Submission failed');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      setStatusMessage({
        type: 'error',
        message: 'Failed to submit booking. Please try again or contact us directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [booking, validateStep]);

  // Clear status message after 5 seconds
  React.useEffect(() => {
    if (statusMessage.message) {
      const timeout = setTimeout(() => {
        if (statusMessage.type !== 'success') {
          setStatusMessage({ type: '', message: '' });
        }
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [statusMessage]);

  return (
    <section className="max-w-2xl mx-auto py-16 px-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-3xl font-bold mb-8 text-center text-green-800">
        Booking Services Step by Step
      </h2>

      {/* Step Indicators */}
      <nav 
        className="flex justify-between mb-8 gap-2"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={4}
        aria-valuenow={booking.step}
        aria-valuetext={`Step ${booking.step} of 4`}
      >
        <StepIndicator 
          step={1} 
          title="Select Service" 
          isActive={booking.step === 1} 
          isCompleted={booking.step > 1} 
        />
        <StepIndicator 
          step={2} 
          title="Date & Time" 
          isActive={booking.step === 2} 
          isCompleted={booking.step > 2} 
        />
        <StepIndicator 
          step={3} 
          title="Personal Info" 
          isActive={booking.step === 3} 
          isCompleted={booking.step > 3} 
        />
        <StepIndicator 
          step={4} 
          title="Confirm" 
          isActive={booking.step === 4} 
          isCompleted={false} 
        />
      </nav>

      {/* Steps Container */}
      <div className="min-h-[500px] relative overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${(booking.step - 1) * 100}%)` }}
        >
          {/* Step 1: Service Selection */}
          <div className="w-full flex-shrink-0">
            <Step1ServiceSelection
              booking={booking}
              updateBooking={updateBooking}
              onServiceSelect={openServiceModal}
              onNext={nextStep}
            />
          </div>

          {/* Step 2: Date & Time */}
          <div className="w-full flex-shrink-0">
            <Step2DateTime
              booking={booking}
              updateBooking={updateBooking}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          </div>

          {/* Step 3: Personal Info */}
          <div className="w-full flex-shrink-0">
            <Step3PersonalInfo
              booking={booking}
              updateBooking={updateBooking}
              onNext={nextStep}
              onPrevious={prevStep}
            />
          </div>

          {/* Step 4: Confirmation */}
          <div className="w-full flex-shrink-0">
            <Step4Confirmation
              booking={booking}
              onSubmit={submitBooking}
              onPrevious={prevStep}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Status Messages */}
      {statusMessage.message && (
        <div 
          className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            statusMessage.type === 'success' 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}
          role="alert"
          aria-live="assertive"
        >
          {statusMessage.message}
        </div>
      )}

      {/* Service Options Modal */}
      <ServiceModal
        isOpen={modalData.isOpen}
        service={modalData.service}
        onClose={closeModal}
        onSelectOption={(option: string) => selectServiceOption(modalData.service?.name || '', option)}
        selectedOption={booking.option}
      />

      {/* Screen Reader Instructions */}
      <div className="sr-only">
        <h3>Booking Form Instructions</h3>
        <p>This is a 4-step booking form. Use Tab to navigate between elements and Enter or Space to activate buttons. Form validation will provide feedback as you complete each field.</p>
      </div>
    </section>
  );
};

export default BookingComponent;