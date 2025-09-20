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
          { id: 'full-face-waxing', name: 'Full Face Waxing', price: '$7', options: [
            { name: 'Full Face Waxing', time: '30 mins', price: '$25' },
            { name: 'Eyebrows', time: '15 mins', price: '$13' },
            { name: 'Upper Lip', time: '5 mins', price: '$7' },
            { name: 'Chin', time: '5 mins', price: '$8' }
          ], duration: ' 5mins - 30 mins', description: 'Our facial waxing service includes eyebrow shaping, upper lip, chin, and cheek waxing for smooth, flawless skin. Enjoy precision and comfort with long-lasting results.' },
          { id: 'full-body-waxing', name: 'Full Body Waxing', price: '$20', options: [
            { name: 'Full Body Waxing', time: '1 hr', price: '$150' },
            { name: 'UnderArms (Ampit)', time: '20 mins', price: '$20' },
            { name: 'UnderArms (Ampit)', time: '20 mins', price: '$20' },
            { name: 'Arms (Full)', time: '25 mins', price: '$30' },
            { name: 'Legs (Full)', time: '40 mins', price: '$50' },
            { name: 'Bikini Line', time: '25 mins', price: '$25' },
            { name: 'Brazillian Bikini', time: '20 mins', price: '$45' },
            { name: 'Back', time: '25 mins', price: '$65' },
            { name: 'Chest', time: '20 mins', price: '$50' },
          ], duration: '20 mins - 1 hr', description: 'Semi-permanent eyebrow enhancement.' },
          { id: 'house-special-facial', name: 'House Special Facial', price: '$30', options: [
            { name: 'Natural', time: '35 mins', price: '$150' },
            { name: 'Bold', time: '45 mins', price: '$160' }
          ], duration: '35-45 mins', description: 'Combination of microblading and shading.' },
          { id: 'lip-blush-featured', name: 'Lip Blush', price: '$90', options: [
            { name: 'Soft', time: '25 mins', price: '$90' },
            { name: 'Bold', time: '30 mins', price: '$95' }
          ], duration: '25-30 mins', description: 'Adds color and definition to lips.' },
          { id: 'classic-eyeliner', name: 'Classic Eyeliner', price: '$80', options: [
            { name: 'Thin', time: '20 mins', price: '$80' },
            { name: 'Thick', time: '25 mins', price: '$85' }
          ], duration: '20-25 mins', description: 'Defines eyes with classic liner.' },
          { id: 'hydra-facial', name: 'Hydra Facial', price: '$120', options: [
            { name: 'Hydrating', time: '30 mins', price: '$120' },
            { name: 'Brightening', time: '35 mins', price: '$125' }
          ], duration: '30-35 mins', description: 'Deep cleansing and hydration.' }
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
          { id: 'eyebrow-wax-brows', name: 'Eyebrow Wax', price: '$15', options: [
            { name: 'Basic', time: '10 mins' },
            { name: 'Premium', time: '15 mins' }
          ] },
          { id: 'eyebrow-tint', name: 'Eyebrow Tint', price: '$20', options: [
            { name: 'Light', time: '10 mins' },
            { name: 'Dark', time: '12 mins' }
          ] },
          { id: 'eyebrow-threading', name: 'Eyebrow Threading', price: '$18', options: [
            { name: 'Standard', time: '10 mins' }
          ] },
          { id: 'brow-lamination', name: 'Brow Lamination', price: '$45', options: [
            { name: 'Natural', time: '20 mins' },
            { name: 'Bold', time: '25 mins' }
          ] },
          { id: 'brow-henna', name: 'Brow Henna', price: '$35', options: [
            { name: 'Brown', time: '15 mins' },
            { name: 'Black', time: '15 mins' }
          ] },
          { id: 'brow-shaping', name: 'Brow Shaping', price: '$25', options: [
            { name: 'Natural', time: '10 mins' },
            { name: 'Arched', time: '12 mins' }
          ] }
        ]
      },
      {
        title: 'Lashes',
        services: [
          { id: 'lash-lift', name: 'Lash Lift', price: '$60', options: [
            { name: 'Basic', time: '30 mins' },
            { name: 'Premium', time: '40 mins' }
          ] },
          { id: 'lash-tint', name: 'Lash Tint', price: '$25', options: [
            { name: 'Black', time: '15 mins' },
            { name: 'Brown', time: '15 mins' }
          ] },
          { id: 'lash-extension', name: 'Lash Extension', price: '$80', options: [
            { name: 'Natural', time: '60 mins' },
            { name: 'Dramatic', time: '75 mins' }
          ] },
          { id: 'lash-perm', name: 'Lash Perm', price: '$70', options: [
            { name: 'Curl', time: '35 mins' },
            { name: 'Volume', time: '40 mins' }
          ] },
          { id: 'lash-removal', name: 'Lash Removal', price: '$30', options: [
            { name: 'Safe Removal', time: '20 mins' }
          ] },
          { id: 'lash-botox', name: 'Lash Botox', price: '$50', options: [
            { name: 'Treatment', time: '25 mins' }
          ] }
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
          { id: 'lip-blush-lips', name: 'Lip Blush', price: '$90', options: [
            { name: 'Soft', time: '25 mins', price: '$90' },
            { name: 'Bold', time: '30 mins', price: '$95' }
          ] },
          { id: 'lip-liner', name: 'Lip Liner', price: '$75', options: [
            { name: 'Natural', time: '20 mins', price: '$75' },
            { name: 'Defined', time: '25 mins', price: '$80' }
          ] },
          { id: 'full-lip-color', name: 'Full Lip Color', price: '$120', options: [
            { name: 'Nude', time: '30 mins', price: '$120' },
            { name: 'Red', time: '35 mins', price: '$125' },
            { name: 'Pink', time: '35 mins', price: '$125' }
          ] },
          { id: 'lip-neutralization', name: 'Lip Neutralization', price: '$60', options: [
            { name: 'Light', time: '20 mins', price: '$60' },
            { name: 'Medium', time: '25 mins', price: '$65' }
          ] },
          { id: 'russian-lips', name: 'Russian Lips', price: '$150', options: [
            { name: 'Subtle', time: '40 mins', price: '$150' },
            { name: 'Dramatic', time: '45 mins', price: '$160' }
          ] }
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
          { id: 'classic-eyeliner-tattoo', name: 'Classic Eyeliner', price: '$80', options: [
            { name: 'Thin', time: '20 mins', price: '$80' },
            { name: 'Thick', time: '25 mins', price: '$85' }
          ] },
          { id: 'designer-eyeliner', name: 'Designer Eyeliner', price: '$100', options: [
            { name: 'Simple', time: '30 mins', price: '$100' },
            { name: 'Complex', time: '40 mins', price: '$110' }
          ] },
          { id: 'colored-eyeliner', name: 'Colored Eyeliner', price: '$110', options: [
            { name: 'Blue', time: '30 mins', price: '$110' },
            { name: 'Green', time: '30 mins', price: '$110' },
            { name: 'Purple', time: '30 mins', price: '$110' }
          ] }
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
          { id: 'eyebrow-wax-waxing', name: 'Eyebrow Wax', price: '$15', options: [
            { name: 'Basic', time: '10 mins', price: '$15' },
            { name: 'Premium', time: '15 mins', price: '$18' }
          ] },
          { id: 'upper-lip-wax', name: 'Upper Lip Wax', price: '$12', options: [
            { name: 'Standard', time: '8 mins', price: '$12' }
          ] }
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
          { id: 'scalp-massage', name: 'Scalp Massage', price: '$30', options: [
            { name: '30 min', time: '30 mins', price: '$30' },
            { name: '60 min', time: '60 mins', price: '$50' }
          ] },
          { id: 'herbal-hair-wash', name: 'Herbal Hair Wash', price: '$25', options: [
            { name: 'Basic', time: '15 mins', price: '$25' },
            { name: 'Premium', time: '20 mins', price: '$30' }
          ] }
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
          { id: 'acne-treatment', name: 'Acne Treatment', price: '$80', options: [
            { name: 'Basic', time: '30 mins', price: '$80' },
            { name: 'Advanced', time: '45 mins', price: '$100' }
          ] },
          { id: 'hydra-facial-facial', name: 'Hydra Facial', price: '$120', options: [
            { name: 'Hydrating', time: '30 mins', price: '$120' },
            { name: 'Brightening', time: '35 mins', price: '$125' }
          ] },
          { id: 'chemical-peel', name: 'Chemical Peel', price: '$100', options: [
            { name: 'Light', time: '20 mins', price: '$100' },
            { name: 'Medium', time: '30 mins', price: '$120' }
          ] }
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
              serviceNames: booking.services.reduce((names: { [key: string]: string }, serviceId) => {
                // Find service name from SERVICE_CATEGORIES
                for (const category of SERVICE_CATEGORIES) {
                  for (const group of category.groups) {
                    const service = group.services.find(s => s.id === serviceId);
                    if (service) {
                      names[serviceId] = service.name;
                      break;
                    }
                  }
                }
                return names;
              }, {}),
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
      className="booking-step-section w-full min-h-screen flex flex-col justify-start items-center"
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
        <h2 className="text-3xl font-bold text-center text-green-800 whitespace-nowrap" style={{ fontFamily: 'Tartuffo, serif' }}>
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