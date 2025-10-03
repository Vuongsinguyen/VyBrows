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
    description: '',
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
          ], duration: '20 mins - 1 hr', description: 'Our body waxing service offers smooth, hair-free skin with long-lasting results. Whether you need waxing for your legs, arms, bikini line, back, or chest, our skilled estheticians ensure a comfortable, efficient experience. Using high-quality wax, we gently remove unwanted hair, leaving your skin soft and silky. Ideal for those seeking a flawless, hair-free look, our body waxing is designed to minimize discomfort and provide lasting smoothness. Book your appointment today and enjoy the confidence of smooth, radiant skin!' },
          { id: 'house-special-facial', name: 'House Special Facial', price: '$30', options: [
            { name: 'House Special Facial', time: '1 hr', price: '$60' },
            { name: '(Add on) Acne Extraction', time: '30 mins', price: '$30', description: 'For an added boost, add sanitation acne extractions for just $30—available exclusively with the House Special Facial service. Regular price is $50.' }
          ], duration: '30 mins - 1 hr', description: 'Indulge in our luxurious House Special Facial, a personalized treatment designed to rejuvenate and refresh your skin. Tailored to your unique needs, this facial includes deep cleansing, exfoliation, a customized mask, and a relaxing massage, leaving your skin glowing and revitalized. Our expert estheticians will target your specific skin concerns, whether it\'s hydration, anti-aging, or acne. Finish with a nourishing serum and SPF protection for a flawless, radiant complexion. Treat yourself to the ultimate skincare experience—your skin deserves it!' },
          { id: 'basic-head-spa', name: 'Basic Head Spa', price: '$40', options: [], duration: '35 mins', description: 'A basic head spa is a relaxing treatment that focuses on the scalp, hair, and neck. It typically involves gentle massage, cleansing, and conditioning to improve scalp health, relieve tension, and promote relaxation. The treatment helps stimulate blood circulation, reduce stress, and rejuvenate the hair, leaving it feeling refreshed and nourished.' },
          { id: 'hair-stroke-6-week-retouch', name: 'Hairstroke (6 week retouch)', price: '$50', options: [], duration: '1 hr', description: 'Enhance your natural beauty with our Hairstroke (6 week retouch) service. This semi-permanent makeup technique creates fine, hair-like strokes to fill in and define your eyebrows, giving them a fuller and more polished look. Perfect for those who want to maintain their eyebrow shape and color, this retouch session ensures your brows stay fresh and vibrant. Our skilled technicians use high-quality pigments and precise application methods to achieve a natural appearance that complements your facial features. Book your appointment today and enjoy beautifully defined eyebrows that last!' }, 
          { id: 'color-boost-retouch', name: 'Color Boost Retouch (within 6 weeks)', price: '$50', options: [], duration: '2 hrs', description: 'Eyeliners, Eyebrow touch-up for VyBrows returning clients. Price ranges from $50-$100 (depending on treatment).' }
        ]
      }
    ]
  },
  {
    key: 'brows-lashes',
    title: 'Brows & Lashes',
    description: '',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'brow-shape-color-direction', name: 'Brow Shape/Color Direction', price: '$550', options: [], duration: '1 hr', description: 'This price only applies to corrections made to brows originally done by a location other than VyBrows' },
          { id: 'hairstroke-6week-retouch-1', name: 'Hairstroke (6 week retouch)', price: '$50', options: [], duration: '1 hr', description: 'Enhance your natural beauty with our Hairstroke (6 week retouch) service. This semi-permanent makeup technique creates fine, hair-like strokes to fill in and define your eyebrows, giving them a fuller and more polished look. Perfect for those who want to maintain their eyebrow shape and color, this retouch session ensures your brows stay fresh and vibrant. Our skilled technicians use high-quality pigments and precise application methods to achieve a natural appearance that complements your facial features. Book your appointment today and enjoy beautifully defined eyebrows that last!' },
          { id: 'color-boost-retouch-sub', name: 'Color Boost Retouch (within 18 months)', price: '$200', options: [], duration: '1 hr, 15 mins - Retouch within 18 months', description: 'Eyebrow touch-up for VyBrows returning clients. Price ranges from $200-$250 (depending on treatment).' },
          { id: 'color-boost-retouch-sub2', name: 'Color Boost Retouch (within 8 months)', price: '$100', options: [], duration: '1 hr, 15 mins', description: 'Eyebrow touch-up for VyBrows returning clients. Price ranges from $100-$150 (depending on treatment),' },
          { id: 'eyebrow-hair-stroke', name: 'Eyebrow Hair Stroke', price: '$450', options: [], duration: '1 hr, 30 mins', description: 'Our Eyebrow Hair Stroke service creates natural-looking, hair-like strokes for fuller brows.' },
          { id: 'Microblading', name: 'Microblading', price: '$400', options: [], duration: '1 hr, 30 mins', description: 'Microblading is a semi-permanent makeup technique that creates the illusion of fuller eyebrows. Our skilled technicians use a manual blade to deposit pigment into the skin, resulting in natural-looking hair strokes. This service is perfect for those with sparse or uneven brows who want to enhance their shape and fullness. Book your appointment today and wake up with beautifully defined brows!' },
          { id: 'ombre-eyebrow-shading', name: 'Ombre Eyebrow Shading', price: '$350', options: [], duration : '1 hr, 30 mins', description: 'Ombre Eyebrow Shading is a semi-permanent makeup technique that creates a soft, gradient effect for fuller, more defined brows. Our skilled technicians use a digital machine to deposit pigment into the skin, resulting in a natural-looking ombre finish. This service is perfect for those who want to enhance their eyebrow shape and color with a subtle, powdery look. Book your appointment today and enjoy beautifully shaded brows that last!' },
          { id: 'eyebrow-shading', name: 'Eyebrow Shading (9 months or longer)', price: '$300', options: [], duration: '1 hr, 30 mins - New Set', description: '' },
          { id: 'classic-fill', name: 'Classic Fill', price: '$60', options: [], duration: '1 hr', description: '' }
        ]
      },
    ]
  },
  {
    key: 'lip-tattooing',
    title: 'Lip Tattooing',
    description: '',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'color-boost-retouch-lip', name: 'Color Boost Retouch (within 3 months)', price: '$100', options: [], duration: '1 hr, 15 mins', description: 'Service estimate applicable to returning VyBrow clients only.' },
          { id: 'darklip-removal', name: 'Dark Lip Removal', price: '$150', options: [
            { name: '2nd or 3rd section', time: '1 hr, 30 mins', price: '$150' },
            { name: 'First section', time: '1 hr, 30 mins', price: '$from 400' },
          ], duration: '1hr, 30 mins', description: 'Dark lips removed from $400 ' },
          { id: 'classic-shading', name: 'Classic-Shading', price: '$400', options: [], duration: '2 hrs', description: '' },
          { id: 'collagen-lips', name: 'Collagen Lips', price: '$500', options: [], duration: '2 hrs', description: '' },
          { id: 'stemcell-lips', name: 'Stemcell Lips', price: '$600', options: [], duration: '2 hrs', description: '' }
        ]
      }
    ]
  },
  {
    key: 'eyeliner',
    title: 'Eyeliner',
    description: '',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'full-set', name: 'Full Set', price: '$400', options: [], duration: '1 hr - pricing starts at $400', description: '' },
          { id: 'upper-eyeliner', name: 'Upper Eyeliner', price: '$300', options: [], duration: '1 hr', description: '' },
          { id: 'color-boost-retouch-eyeliner', name: 'Color Boost Retouch (within 6 weeks)', price: '$50', options: [], duration: '2 hrs', description: 'Eyeliners, Eyebrow touch-up for VyBrows returning clients. Price ranges from $50-$100 (depending on treatment).' }
        ]
      }
    ]
  },
  {
    key: 'waxing',
    title: 'Waxing',
    description: 'Enjoy smooth, silky skin with our professional waxing services. From brows to legs, our skilled estheticians ensure a comfortable, long-lasting, and hair-free result. Book your session today!',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'full-body-waxing-sub', name: 'Full Body Waxing', price: '$20', options: [
            { name: 'Full Body Waxing', time: '1 hr', price: 'from $150' },
            { name: 'UnderArms (Ampit)', time: '20 mins', price: '$30' },
            { name: 'Arms (full)', time: '25 mins', price: 'from $30' },
            { name: 'Legs (full)', time: '25 mins', price: 'from $30' },
            { name: 'Bikini line', time: '25 mins', price: 'from $35' },
            { name: 'Brazillian Bikini', time: '20 mins', price: 'from $45' },
            { name: 'Back', time: '25 mins', price: 'from $65' },
            { name: 'Chest', time: '20 mins', price: 'from $50' }
          ], duration: ' 20 mins - 1 hr', description: 'Our body waxing service offers smooth, hair-free skin with long-lasting results. Whether you need waxing for your legs, arms, bikini line, back, or chest, our skilled estheticians ensure a comfortable, efficient experience. Using high-quality wax, we gently remove unwanted hair, leaving your skin soft and silky. Ideal for those seeking a flawless, hair-free look, our body waxing is designed to minimize discomfort and provide lasting smoothness. Book your appointment today and enjoy the confidence of smooth, radiant skin!' },
          { id: 'full-face-waxing-sub', name: 'Full Face Waxing', price: '$7', options: [
            { name: 'Full Face Waxing', time: '30 mins', price: '$25' },
            { name: 'Eyebrows', time: '15 mins', price: '$13' },
            { name: 'Upper lip', time: '5 mins', price: '$7' },
            { name: 'Chin', time: '5 mins', price: '$8' }
          ], duration: '5 mins - 30 mins', description: 'Our facial waxing service includes eyebrow shaping, upper lip, chin, and cheek waxing for smooth, flawless skin. Enjoy precision and comfort with long-lasting results.' },
        ]  
      }
    ]
  },
  {
    key: 'head-spa',
    title: 'Head Spa',
    description: 'Relax with our rejuvenating Head Spa, featuring a soothing scalp massage and nourishing hair care. Revitalize your hair, reduce stress, and enjoy soft, shiny results. Book your session today!',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'deluxe-head-spa', name: 'Deluxe Head Spa', price: '$120', options: [], duration: '1 hr, 30 mins', description: 'A deluxe head spa offers an enhanced version of the premium experience, designed for ultimate relaxation and rejuvenation. It begins with a soothing scalp massage, followed by a cleansing with herbal shampoo and a nourishing steam treatment with herbal extracts for the hair. A relaxing facial is included, along with a blow-dry to finish. The deluxe experience also adds a hand and foot massage with hot stones to relieve tension, light therapy to promote skin and hair health, and warm Himalayan salt therapy to soothe muscles and enhance relaxation. This comprehensive treatment offers a truly indulgent and revitalizing experience.' },
          { id: 'basic-head-spa', name: 'Basic Head Spa', price: '$40', options: [], duration: '45 mins', description: 'A basic head spa is a relaxing treatment that focuses on the scalp, hair, and neck. It typically involves gentle massage, cleansing, and conditioning to improve scalp health, relieve tension, and promote relaxation. The treatment helps stimulate blood circulation, reduce stress, and rejuvenate the hair, leaving it feeling refreshed and nourished.' },
          { id: 'premium-head-spa', name: 'Premium Head Spa', price: '$80', options: [], duration: '1 hr', description: 'A premium head spa is an indulgent, all-inclusive treatment designed to rejuvenate both the scalp and mind. It begins with a soothing scalp massage to improve circulation, followed by a cleansing with herbal shampoo to detoxify and nourish the scalp. The experience includes a relaxing facial to refresh the skin, neck and shoulder massage and a blow-dry to leave your hair smooth and styled. This luxurious treatment promotes relaxation, enhances hair health, and provides a complete pampering experience.' }
        ]
      }
    ]
  },
  {
    key: 'facial-treatment',
    title: 'Facial and Treatment',
    description: '',
    groups: [
      {
        title: 'Popular Services',
        services: [
          { id: 'house-special-facial', name: 'House Special Facial', price: '$30', options: [
            { name: 'House Special Facial', time: '1 hr', price: '$60' },
            { name: '(Add on) Acne Extraction', time: '30 mins', price: '$30', description: 'For an added boost, add sanitation acne extractions for just $30—available exclusively with the House Special Facial service. Regular price is $50.' }
          ], duration: '30 mins - 1 hr', description: 'Indulge in our luxurious House Special Facial, a personalized treatment designed to rejuvenate and refresh your skin. Tailored to your unique needs, this facial includes deep cleansing, exfoliation, a customized mask, and a relaxing massage, leaving your skin glowing and revitalized. Our expert estheticians will target your specific skin concerns, whether it\'s hydration, anti-aging, or acne. Finish with a nourishing serum and SPF protection for a flawless, radiant complexion. Treat yourself to the ultimate skincare experience—your skin deserves it!'},
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
        
        // Full name - only check if not empty
        if (!booking.fullName?.trim()) {
          return { isValid: false, message: 'Please enter your name' };
        }
        // Phone - check format
        if (!phoneRegex.test(booking.phone)) {
          return { isValid: false, message: 'Please enter a valid phone number (10-15 digits)' };
        }
        // Email - only validate format if provided (optional field)
        if (booking.email?.trim() && !emailRegex.test(booking.email)) {
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
        
        // Redirect to home page after successful submission
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
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
          onClick={() => {
            if (booking.step === 1) {
              window.location.href = '/';
            } else {
              prevStep(); // Go back to previous step
            }
          }}
          className={
            booking.step === 1
              ? "buttonBack mr-4 p-2 rounded-full bg-green-800 text-white border border-green-800 hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              : "buttonBack mr-4 p-2 rounded-[5px] bg-white border border-green-800 text-green-800 hover:bg-green-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          }
          aria-label={booking.step === 1 ? "Back to homepage" : "Back to previous step"}
          type="button"
        >
          {booking.step === 1 ? (
            // Home icon for Step 1
            <svg width="24" height="24" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M13.5048 27.3334V19.3334H18.8381V27.3334H25.5048V16.6667H29.5048L16.1715 4.66675L2.83812 16.6667H6.83812V27.3334H13.5048Z" fill="currentColor"/>
            </svg>
          ) : (
            // Back arrow icon for Step 2, 3, 4
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
          <h2
            className="text-3xl font-bold text-center text-green-800 whitespace-nowrap block md:hidden"
            style={{ fontFamily: 'Tartuffo, serif' }}
          >
            Services
          </h2>
          <h2
            className="text-3xl font-bold text-center text-green-800 whitespace-nowrap hidden md:block"
            style={{ fontFamily: 'Tartuffo, serif' }}
          >
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
  <div className="w-full max-w-[1330px] mx-auto flex flex-col justify-start items-center min-h-[500px]">
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