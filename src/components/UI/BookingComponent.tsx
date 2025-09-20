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
          { id: 'shading-ombre', name: 'Shading Ombré', price: '$100', options: ['Classic', 'Ombre'] },
          { id: 'micro-blading', name: 'Micro Blading', price: '$120', options: ['Micro', 'Nano'] },
          { id: 'combo-brows', name: 'Combo Brows', price: '$150', options: ['Natural', 'Bold'] },
          { id: 'lip-blush-featured', name: 'Lip Blush', price: '$90', options: ['Soft', 'Bold'] },
          { id: 'classic-eyeliner', name: 'Classic Eyeliner', price: '$80', options: ['Thin', 'Thick'] },
          { id: 'hydra-facial', name: 'Hydra Facial', price: '$120', options: ['Hydrating', 'Brightening'] }
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
          { id: 'eyebrow-wax-brows', name: 'Eyebrow Wax', price: '$15', options: ['Basic', 'Premium'] },
          { id: 'eyebrow-tint', name: 'Eyebrow Tint', price: '$20', options: ['Light', 'Dark'] },
          { id: 'eyebrow-threading', name: 'Eyebrow Threading', price: '$18', options: ['Standard'] },
          { id: 'brow-lamination', name: 'Brow Lamination', price: '$45', options: ['Natural', 'Bold'] },
          { id: 'brow-henna', name: 'Brow Henna', price: '$35', options: ['Brown', 'Black'] },
          { id: 'brow-shaping', name: 'Brow Shaping', price: '$25', options: ['Natural', 'Arched'] }
        ]
      },
      {
        title: 'Lashes',
        services: [
          { id: 'lash-lift', name: 'Lash Lift', price: '$60', options: ['Basic', 'Premium'] },
          { id: 'lash-tint', name: 'Lash Tint', price: '$25', options: ['Black', 'Brown'] },
          { id: 'lash-extension', name: 'Lash Extension', price: '$80', options: ['Natural', 'Dramatic'] },
          { id: 'lash-perm', name: 'Lash Perm', price: '$70', options: ['Curl', 'Volume'] },
          { id: 'lash-removal', name: 'Lash Removal', price: '$30', options: ['Safe Removal'] },
          { id: 'lash-botox', name: 'Lash Botox', price: '$50', options: ['Treatment'] }
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
          { id: 'lip-blush-lips', name: 'Lip Blush', price: '$90', options: ['Soft', 'Bold'] },
          { id: 'lip-liner', name: 'Lip Liner', price: '$75', options: ['Natural', 'Defined'] },
          { id: 'full-lip-color', name: 'Full Lip Color', price: '$120', options: ['Nude', 'Red', 'Pink'] },
          { id: 'lip-neutralization', name: 'Lip Neutralization', price: '$60', options: ['Light', 'Medium'] },
          { id: 'russian-lips', name: 'Russian Lips', price: '$150', options: ['Subtle', 'Dramatic'] }
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
          { id: 'classic-eyeliner-tattoo', name: 'Classic Eyeliner', price: '$80', options: ['Thin', 'Thick'] },
          { id: 'designer-eyeliner', name: 'Designer Eyeliner', price: '$100', options: ['Simple', 'Complex'] },
          { id: 'colored-eyeliner', name: 'Colored Eyeliner', price: '$110', options: ['Blue', 'Green', 'Purple'] }
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
          { id: 'eyebrow-wax-waxing', name: 'Eyebrow Wax', price: '$15', options: ['Basic', 'Premium'] },
          { id: 'upper-lip-wax', name: 'Upper Lip Wax', price: '$12', options: ['Standard'] }
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
          { id: 'scalp-massage', name: 'Scalp Massage', price: '$30', options: ['30 min', '60 min'] },
          { id: 'herbal-hair-wash', name: 'Herbal Hair Wash', price: '$25', options: ['Basic', 'Premium'] }
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
          { id: 'acne-treatment', name: 'Acne Treatment', price: '$80', options: ['Basic', 'Advanced'] },
          { id: 'hydra-facial-facial', name: 'Hydra Facial', price: '$120', options: ['Hydrating', 'Brightening'] },
          { id: 'chemical-peel', name: 'Chemical Peel', price: '$100', options: ['Light', 'Medium'] }
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
    category: 'featured',
    services: [], // Changed from service: '' to services: []
    options: {}, // Changed from option: '' to options: {}
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
        if (!booking.services.length) {
          return { isValid: false, message: 'Please select at least one service' };
        }
        // Check if all selected services have options
        for (const serviceId of booking.services) {
          if (!booking.options[serviceId]) {
            return { isValid: false, message: `Please select an option for service` };
          }
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
    // Open modal for option selection (allow for both selected and unselected services)
    setModalData({
      isOpen: true,
      service: service
    });
  }, []);

  const selectServiceOption = useCallback((option: string) => {
    // Add service to services array (if not already present) and set/replace option
    if (modalData.service) {
      setBooking(prev => ({
        ...prev,
        services: prev.services.includes(modalData.service!.id)
          ? prev.services // Keep existing services array if service already selected
          : [...prev.services, modalData.service!.id], // Add service if not already selected
        options: { ...prev.options, [modalData.service!.id]: option } // Always update/replace option
      }));
    }
    closeModal();
  }, [modalData.service]);

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
              services: booking.services,
              options: booking.options,
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
            category: 'featured',
            services: [],
            options: {},
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
      className="booking-step-section w-full min-h-screen flex flex-col justify-center items-center"
      aria-label="Service booking form"
    >
      <div className="sticky top-0 z-50 w-full h-[100px] bg-white flex items-center justify-start px-4 border-b border-black/5">
        <button
          onClick={() => window.location.href = '/'}
          className="buttonBack mr-4 p-2 rounded-[5px] bg-white border border-green-800 text-green-800 hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          aria-label="Back to homepage"
          type="button"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-5xl font-bold text-center text-green-800" style={{ fontFamily: 'Tartuffo, serif' }}>
          Book VyBrows Beauty Services
        </h2>
      </div>
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
      <div className="w-full max-w-[1330px] flex flex-col justify-start items-center min-h-[500px]">
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
        selectedOption={modalData.service ? booking.options[modalData.service.id] || '' : ''}
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