// Step1ServiceSelection.tsx - Service selection with category tabs
import React from 'react';
import type { BookingState, Service } from './BookingComponent';
import { SERVICE_CATEGORIES } from './BookingComponent';

interface Step1Props {
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  onServiceSelect: (service: Service) => void;
  onNext: () => void;
}

const Step1ServiceSelection: React.FC<Step1Props> = ({
  booking,
  updateBooking,
  onServiceSelect,
  onNext
}) => {
  // Handle category tab switching
  const handleCategoryChange = (category: string) => {
    updateBooking({ category, service: '', option: '' });
  };

  // Handle service button click
  const handleServiceClick = (service: Service) => {
    onServiceSelect(service);
  };

  // Get current category data
  const currentCategory = SERVICE_CATEGORIES.find(cat => cat.key === booking.category);

  return (
    <div 
      role="tabpanel"
      aria-labelledby="step-1-title"
      tabIndex={0}
      className="p-6"
    >
      <h3 id="step-1-title" className="text-xl font-bold mb-6 text-center text-green-800">
        Select Your Service
      </h3>

      {/* Category Tabs */}
      <fieldset className="mb-8">
        <legend className="text-lg font-semibold mb-4 text-green-800">
          Service Category
        </legend>
        
        <div 
          className="flex flex-wrap gap-4 mb-6" 
          role="tablist" 
          aria-label="Service categories"
        >
          {SERVICE_CATEGORIES.map((category) => (
            <button
              key={category.key}
              className={`px-4 py-2 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                booking.category === category.key
                  ? 'bg-green-800 text-white transform scale-105'
                  : 'bg-gray-200 text-gray-700 hover:bg-yellow-400 hover:text-green-800'
              }`}
              role="tab"
              aria-selected={booking.category === category.key}
              aria-controls={`services-${category.key}`}
              onClick={() => handleCategoryChange(category.key)}
              type="button"
              title={category.description}
            >
              {category.title}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Services */}
      <fieldset>
        <legend className="text-lg font-semibold mb-4 text-green-800">
          Available Services
        </legend>
        
        <div 
          className="space-y-6"
          id={`services-${booking.category}`}
          role="tabpanel"
          aria-labelledby={`tab-${booking.category}`}
          aria-live="polite"
        >
          {currentCategory?.groups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h4 className="font-semibold mb-3 text-green-700">{group.title}</h4>
              <div className="grid gap-3 md:grid-cols-2">
                {group.services.map((service, serviceIndex) => (
                  <button
                    key={serviceIndex}
                    className={`p-4 text-left rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      booking.service === service.name
                        ? 'border-green-600 bg-green-50 text-green-800'
                        : 'border-gray-200 bg-yellow-100 hover:border-green-400 hover:bg-yellow-200'
                    }`}
                    onClick={() => handleServiceClick(service)}
                    type="button"
                    aria-describedby={`service-desc-${service.name.replace(/\s+/g, '-').toLowerCase()}`}
                  >
                    <div className="font-medium text-lg">{service.name}</div>
                    <div className="text-sm opacity-75 font-semibold">{service.price}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Options: {service.options.join(', ')}
                    </div>
                    <div 
                      id={`service-desc-${service.name.replace(/\s+/g, '-').toLowerCase()}`}
                      className="sr-only"
                    >
                      {service.name} service, price {service.price}, options: {service.options.join(', ')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <button
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            booking.service && booking.option
              ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={onNext}
          type="button"
          disabled={!booking.service || !booking.option}
          aria-describedby="step-1-help"
        >
          Next: Select Date & Time
        </button>
      </div>
      
      <div id="step-1-help" className="sr-only">
        Proceed to step 2 to select your preferred date and time
      </div>

      {/* Selected Service Display */}
      {booking.service && booking.option && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800">Selected:</h4>
          <p className="text-green-700">
            {booking.service} ({booking.option})
          </p>
        </div>
      )}
    </div>
  );
};

export default Step1ServiceSelection;