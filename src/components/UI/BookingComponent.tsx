// BookingComponent.tsx - Modern React-based booking system
import React, { useState, useCallback, useEffect } from 'react';
import Step1ServiceSelection from './Step1ServiceSelection';
import Step2DateTime from './Step2DateTime';
import Step3PersonalInfo from './Step3PersonalInfo';
import Step4Confirmation from './Step4Confirmation';
import ServiceModal from './ServiceModal';
import type { BookingState, Service, ServiceGroup, ServiceCategory, BookingComponentProps } from '../../types/booking';

// Sample service data
export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    key: 'featured',
    title: 'Featured',
    description: 'Popular services',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { name: 'Shading Ombré', price: '$100', options: ['Classic', 'Ombre'] },
          { name: 'Micro Blading', price: '$120', options: ['Micro', 'Nano'] },
          { name: 'Combo Brows', price: '$150', options: ['Natural', 'Bold'] },
          { name: 'Lip Blush', price: '$90', options: ['Soft', 'Bold'] },
          { name: 'Classic Eyeliner', price: '$80', options: ['Thin', 'Thick'] },
          { name: 'Hydra Facial', price: '$120', options: ['Hydrating', 'Brightening'] }
        ]
      }
    ]
  },
  {
    key: 'brows-lashes',
    title: 'Brows & Lashes',
    description: 'Eyebrow and eyelash services',
    groups: [
      {
        title: 'Brows',
        services: [
          { name: 'Shading Ombré', price: '$100', options: ['Classic', 'Ombre'] },
          { name: 'Micro Blading', price: '$120', options: ['Micro', 'Nano'] },
          { name: 'Combo Brows', price: '$150', options: ['Natural', 'Bold'] },
          { name: 'Eyebrow Wax', price: '$15', options: ['Basic', 'Premium'] },
          { name: 'Eyebrow Tint', price: '$20', options: ['Light', 'Dark'] },
          { name: 'Eyebrow Threading', price: '$18', options: ['Standard'] }
        ]
      },
      {
        title: 'Lashes',
        services: [
          { name: 'Lash Lift', price: '$60', options: ['Basic', 'Premium'] },
          { name: 'Lash Tint', price: '$25', options: ['Black', 'Brown'] },
          { name: 'Lash Extension', price: '$80', options: ['Natural', 'Dramatic'] }
        ]
      }
    ]
  },
  {
    key: 'lip-tattooing',
    title: 'Lip Tattooing',
    description: 'Lip enhancement services',
    groups: [
      {
        title: 'Lips',
        services: [
          { name: 'Lip Blush', price: '$90', options: ['Soft', 'Bold'] },
          { name: 'Lip Liner', price: '$75', options: ['Natural', 'Defined'] },
          { name: 'Full Lip Color', price: '$120', options: ['Nude', 'Red', 'Pink'] },
          { name: 'Lip Neutralization', price: '$60', options: ['Light', 'Medium'] },
          { name: 'Russian Lips', price: '$150', options: ['Subtle', 'Dramatic'] }
        ]
      }
    ]
  },
  {
    key: 'eyeliner',
    title: 'Eyeliner',
    description: 'Eyeliner tattooing services',
    groups: [
      {
        title: 'Eyeliner',
        services: [
          { name: 'Classic Eyeliner', price: '$80', options: ['Thin', 'Thick'] },
          { name: 'Designer Eyeliner', price: '$100', options: ['Simple', 'Complex'] },
          { name: 'Colored Eyeliner', price: '$110', options: ['Blue', 'Green', 'Purple'] }
        ]
      }
    ]
  },
  {
    key: 'waxing',
    title: 'Waxing',
    description: 'Hair removal services',
    groups: [
      {
        title: 'Body Waxing',
        services: [
          { name: 'Eyebrow Wax', price: '$15', options: ['Basic', 'Premium'] },
          { name: 'Upper Lip Wax', price: '$12', options: ['Standard'] }
        ]
      }
    ]
  },
  {
    key: 'head-spa',
    title: 'Head Spa',
    description: 'Scalp and hair treatments',
    groups: [
      {
        title: 'Scalp Treatments',
        services: [
          { name: 'Scalp Massage', price: '$30', options: ['30 min', '60 min'] },
          { name: 'Herbal Hair Wash', price: '$25', options: ['Basic', 'Premium'] }
        ]
      }
    ]
  },
  {
    key: 'facial-treatment',
    title: 'Facial and Treatment',
    description: 'Facial treatments and skincare',
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
  }
];

// Progress indicator component
const StepIndicator: React.FC<{
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
}> = ({ currentStep, totalSteps, stepTitles }) => (
  <div className="flex flex-row justify-between mb-8 relative z-20 px-4 flex-nowrap">
    {stepTitles.map((title, index) => {
      const stepNumber = index + 1;
      const isActive = stepNumber === currentStep;
      const isCompleted = stepNumber < currentStep;
      
      return (
        <div
          key={stepNumber}
          className={`flex-1 text-center p-3 rounded-lg transition-all duration-300 mx-1 ${
            isActive
              ? 'bg-green-800 text-white transform scale-105'
              : isCompleted
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}
          aria-current={isActive ? 'step' : undefined}
        >
          <div className="font-bold text-sm">{stepNumber}. {title}</div>
        </div>
      );
    })}
  </div>
);

const BookingComponent: React.FC = () => {
  // Initial state
  const [booking, setBooking] = useState<BookingState>({
    step: 1,
    category: 'pmu',
    service: '',
    option: '',
    date: '',
    time: '',
    fullName: '',
    phone: '',
    email: '',
    age: '',
    specialRequests: ''
  });

  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    service: Service | null;
  }>({
    isOpen: false,
    service: null
  });

  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error' | '';
    message: string;
  }>({ type: '', message: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

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
        
        if (!nameRegex.test(booking.fullName)) {
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
    setBooking(prev => ({ ...prev, step: prev.step + 1 }));
  }, [booking.step, validateStep]);

  const prevStep = useCallback(() => {
    setStatusMessage({ type: '', message: '' });
    setBooking(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
  }, []);

  // Service selection
  const selectService = useCallback((service: Service) => {
    updateBooking({
      service: service.name,
      option: '' // Reset option when service changes
    });
    
    setModalData({
      isOpen: true,
      service: service
    });
  }, [updateBooking]);

  const selectServiceOption = useCallback((option: string) => {
    updateBooking({ option });
    closeModal();
  }, [updateBooking]);

  const closeModal = useCallback(() => {
    setModalData({ isOpen: false, service: null });
  }, []);

  // API submission
  const submitBooking = useCallback(async () => {
    setIsSubmitting(true);
    setStatusMessage({ type: '', message: '' });

    try {
      // Try Netlify function first (production), fallback to API route (dev)
      const endpoints = [
        '/.netlify/functions/submitBooking',
        '/api/booking'
      ];

      let response: Response | null = null;
      let lastError: Error | null = null;

      for (const endpoint of endpoints) {
        try {
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              service: booking.service,
              option: booking.option,
              date: booking.date,
              time: booking.time,
              name: booking.fullName, // Backend expects 'name' field
              phone: booking.phone,
              email: booking.email,
              notes: booking.specialRequests || '',
              category: booking.category
            }),
          });

          if (response.ok) break; // Success, stop trying
          
        } catch (error) {
          lastError = error as Error;
          continue; // Try next endpoint
        }
      }

      if (!response || !response.ok) {
        throw lastError || new Error('All API endpoints failed');
      }

      const result = await response.json();
      console.log('Booking submission result:', result);

      if (result.success) {
        setStatusMessage({
          type: 'success',
          message: `Booking submitted successfully! ${result.sheetUpdated ? 'Data saved to Google Sheets.' : 'Request processed.'} We will contact you soon to confirm your appointment.`
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          setBooking({
            step: 1,
            category: 'pmu',
            service: '',
            option: '',
            date: '',
            time: '',
            fullName: '',
            phone: '',
            email: '',
            age: '',
            specialRequests: ''
          });
          setStatusMessage({ type: '', message: '' });
        }, 5000);
      } else {
        throw new Error(result.error || `Server error: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Booking submission error:', error);
      setStatusMessage({
        type: 'error',
        message: `Failed to submit booking: ${error.message}. Please try again or contact us directly.`
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [booking]);

  // Clear status message after delay
  useEffect(() => {
    if (statusMessage.message) {
      const timer = setTimeout(() => {
        setStatusMessage({ type: '', message: '' });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [statusMessage]);

  const stepTitles = ['Select Service', 'Date & Time', 'Personal Info', 'Confirm'];

  return (
    <section 
      className="booking-step-section w-full min-h-screen flex flex-col justify-center items-center px-4 py-16"
      aria-label="Service booking form"
    >
      <h2 className="text-5xl font-bold mb-8 text-center text-green-800" style={{ fontFamily: 'Tartuffo, serif' }}>
        Book VyBrows Beauty Services
      </h2>
      {/* Status and Address - Temporarily hidden */}
      {/* <div className="flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        <p className="text-lg text-green-700 font-medium">
          Open until 18:00
        </p>
        <p className="text-lg text-green-700 font-medium">
          13192 Bellaire Boulevard, #B, Alief, Houston, Texas 
          <a 
            href="https://maps.app.goo.gl/XMfN1TfkSsw3Bvju5" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 cursor-pointer underline"
          >
            Get directions
          </a>
        </p>
      </div> */}
      {/* Progress Indicator - Temporarily hidden */}
      {/* <StepIndicator 
        currentStep={booking.step}
        totalSteps={4}
        stepTitles={stepTitles}
      /> */}

      {/* Step Screens */}
      <div className="w-full max-w-2xl mx-auto flex flex-col justify-center items-center min-h-[500px]">
        {booking.step === 1 && (
          <Step1ServiceSelection
            booking={booking}
            updateBooking={updateBooking}
            onServiceSelect={selectService}
            onNext={nextStep}
          />
        )}
        {booking.step === 2 && (
          <Step2DateTime
            booking={booking}
            updateBooking={updateBooking}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        {booking.step === 3 && (
          <Step3PersonalInfo
            booking={booking}
            updateBooking={updateBooking}
            onNext={nextStep}
            onPrevious={prevStep}
          />
        )}
        {booking.step === 4 && (
          <Step4Confirmation
            booking={booking}
            onSubmit={submitBooking}
            onPrevious={prevStep}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      {/* Status Messages */}
      {statusMessage.message && (
        <div 
          className={`mt-6 p-4 rounded-lg text-center font-semibold ${
            statusMessage.type === 'success'
              ? 'bg-green-100 text-green-800 border border-green-300'
              : statusMessage.type === 'error'
              ? 'bg-red-100 text-red-800 border border-red-300'
              : 'bg-blue-100 text-blue-800 border border-blue-300'
          }`}
          role="alert"
          aria-live="polite"
        >
          {statusMessage.message}
        </div>
      )}

      {/* Service Options Modal */}
      <ServiceModal
        isOpen={modalData.isOpen}
        service={modalData.service}
        onClose={closeModal}
        onSelectOption={selectServiceOption}
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