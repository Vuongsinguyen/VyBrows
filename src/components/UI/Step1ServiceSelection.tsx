// Step1ServiceSelection.tsx - Service selection with category tabs
import React, { useEffect, useCallback, useRef } from 'react';
import type { BookingState, Service } from '../../types/booking';
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
  // Get selected services from booking state
  const getSelectedServices = (): Service[] => {
    const services: Service[] = [];
    for (const serviceId of booking.services) {
      for (const category of SERVICE_CATEGORIES) {
        for (const group of category.groups) {
          const service = group.services.find((s: Service) => s.id === serviceId);
          if (service) {
            services.push(service);
            break;
          }
        }
      }
    }
    return services;
  };

  const selectedServices = getSelectedServices();
  // Calculate total using selected option price if available
  const total = selectedServices.reduce((sum: number, service: Service) => {
    const selectedOptionName = booking.options[service.id];
    const selectedOption = service.options.find((opt: any) => opt.name === selectedOptionName);
    const priceStr = selectedOption?.price || service.price;
    return sum + parseFloat((priceStr || '0').replace(/[^\d.]/g, ''));
  }, 0);

  // Handle category tab switching
  const handleCategoryChange = (category: string) => {
    updateBooking({ category });
  };

  // Handle service button click - open modal
  const handleServiceClick = (service: Service) => {
    onServiceSelect(service); // This opens the modal
  };

  // Remove service from selection
  const removeService = (serviceId: string) => {
    // Remove service from services array and clear its option
    const newServices = booking.services.filter(id => id !== serviceId);
    const newOptions = { ...booking.options };
    delete newOptions[serviceId];
    
    updateBooking({ 
      services: newServices,
      options: newOptions
    });
  };

  // Auto-update active category based on scroll position
  const updateBookingRef = useRef(updateBooking);
  
  useEffect(() => {
    updateBookingRef.current = updateBooking;
  }, [updateBooking]);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-80px 0px -50% 0px', // Trigger when section is near top of viewport
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const categoryId = entry.target.id.replace('category-', '');
          if (categoryId !== booking.category) {
            updateBookingRef.current({ category: categoryId });
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all category sections
    SERVICE_CATEGORIES.forEach((category) => {
      const element = document.getElementById(`category-${category.key}`);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, []); // Remove dependencies to prevent re-running

  // Auto-select Featured tab when scrolling to top
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY <= 10 && booking.category !== 'featured') {
        updateBookingRef.current({ category: 'featured' });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [booking.category]);

  // Auto-scroll to show active tab
  useEffect(() => {
    const scrollToActiveTab = () => {
      const tablist = document.getElementById('categoryTablist');
      if (tablist) {
        // Find the active tab
        const activeTab = tablist.querySelector(`[data-category="${booking.category}"]`) as HTMLElement;
        if (activeTab) {
          // Calculate the scroll position to center the active tab
          const tabRect = activeTab.getBoundingClientRect();
          const containerRect = tablist.getBoundingClientRect();
          const scrollLeft = tablist.scrollLeft;
          
          // Calculate how much to scroll to center the tab
          const tabCenter = tabRect.left + tabRect.width / 2;
          const containerCenter = containerRect.left + containerRect.width / 2;
          const scrollAmount = scrollLeft + (tabCenter - containerCenter);
          
          tablist.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    };

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(scrollToActiveTab, 50);
    return () => clearTimeout(timeoutId);
  }, [booking.category]);

  // Get current category data
  const currentCategory = SERVICE_CATEGORIES.find(cat => cat.key === booking.category);

  return (
    <div className="min-h-screen">
      {/* Body */}
      <main className="w-full">
        <div
          role="tabpanel"
          aria-labelledby="step-1-title"
          tabIndex={0}
          className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 px-[20px]"
        >
          {/* Left Column - Categories & Services */}
          <div className="lg:col-span-2">
            {/* Category Tabs */}
            <div className="relative w-full flex items-center sticky top-25 z-40 h-[90px] overflow-hidden bg-white">
              <div
                className="w-full max-w-full flex gap-1 overflow-x-auto scrollbar scrollbar-thumb-gray-400 scrollbar-track-gray-100 justify-start pt-[48px] pb-[30px]"
                style={{ WebkitOverflowScrolling: 'touch', overflowX: 'scroll' }}
                role="tablist"
                aria-label="Service categories"
                id="categoryTablist"
              >
                {SERVICE_CATEGORIES.map((category) => (
                  <a
                    key={category.key}
                    href={`#category-${category.key}`}
                    data-category={category.key}
                    className={`px-4 py-2 rounded-[200px] font-bold whitespace-nowrap transition-all duration-300 ${
                      booking.category === category.key
                        ? 'bg-green-800 text-white'
                        : 'bg-white text-gray-700 hover:bg-black/5 hover:text-green-800'
                    }`}
                    role="tab"
                    aria-selected={booking.category === category.key}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`category-${category.key}`)?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                      updateBooking({ category: category.key });
                    }}
                    type="button"
                    title={category.description}
                  >
                    {category.title}
                  </a>
                ))}
              </div>
              <div className="flex gap-2 ml-2">
                <button
                  className="p-2 rounded-full bg-gray-200 hover:bg-yellow-400 text-gray-700 hover:text-green-800 shadow"
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => {
                    const tablist = document.getElementById('categoryTablist');
                    if (tablist) tablist.scrollBy({ left: -150, behavior: 'smooth' });
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                <button
                  className="p-2 rounded-full bg-gray-200 hover:bg-yellow-400 text-gray-700 hover:text-green-800 shadow"
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => {
                    const tablist = document.getElementById('categoryTablist');
                    if (tablist) tablist.scrollBy({ left: 150, behavior: 'smooth' });
                  }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
              </div>
            </div>

            {/* Services */}
            <fieldset>
              {/* Services - Show all categories */}
              <div className="space-y-8">
                {(() => {
                  let globalServiceIndex = 0;
                  return SERVICE_CATEGORIES.map((category) => (
                  <div
                    key={category.key}
                    id={`category-${category.key}`}
                    className="scroll-mt-20"
                  >
                    <h3 className="text-xl font-bold mb-4 text-green-800 pb-2">
                      {category.title}
                    </h3>
                    <div className="space-y-6">
                      {category.groups.map((group, groupIndex) => (
                        <div key={groupIndex} className="mb-6">
                          <h4 className="font-semibold mb-3 text-green-700">{group.title}</h4>
                          <div className="flex flex-col gap-3">
                            {group.services.map((service, serviceIndex) => {
                              const isSelected = selectedServices.some(s => s.id === service.id);
                              // Map services to images (using service01.avif to service09.avif)
                              const serviceImages = [
                                'service01.avif', 'service02.avif', 'service03.avif', 'service04.avif',
                                'service05.avif', 'service06.avif', 'service07.avif', 'service08.avif', 'service09.avif'
                              ];
                              const imageIndex = serviceIndex % serviceImages.length;
                              const serviceImage = serviceImages[imageIndex];
                              
                              return (
                                <div
                                  key={serviceIndex}
                                  className={`rounded-lg border transition-all duration-300 hover:bg-black/5 cursor-pointer group ${
                                    isSelected
                                      ? 'border-[var(--color-green-800)] bg-white text-black overflow-hidden'
                                      : 'border-black/30 bg-white text-black overflow-hidden hover:bg-white hover:border-[var(--color-green-800)]'
                                  }`}
                                  onClick={() => handleServiceClick(service)}
                                  role="button"
                                  tabIndex={0}
                                  aria-describedby={`service-desc-${service.id}`}
                                >
                                  <div className="flex items-center gap-1 h-[120px]">
                                    {/* Service Image - Hidden */}
                                    <div className="flex-shrink-0 hidden">
                                      <div className="w-[200px] h-[200px] overflow-hidden">
                                        <img
                                          src={`/images/${serviceImage}`}
                                          alt={`${service.name} service`}
                                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                          loading="lazy"
                                        />
                                      </div>
                                    </div>
                                    {/* Service Info + Action Button */}
                                      <div className="servicect px-4 py-2 flex-1 min-w-0 flex items-center gap-20 h-full">
                                      <div className="servicect flex-1 min-w-0 flex flex-col gap-0 items-start h-full">
                                        <div className="font-medium text-lg">{service.name}</div>
                                        <div className="text-[14px] text-gray-500 mb-1">
                                          {service.options && service.options.length > 0 ? (
                                            (() => {
                                              const times = service.options.map(opt => opt.time).filter(time => time);
                                              if (times.length === 1) {
                                                return times[0];
                                              } else if (times.length > 1) {
                                                return `${Math.min(...times.map(t => parseInt(t.replace(/\D/g, ''))))} mins - ${Math.max(...times.map(t => parseInt(t.replace(/\D/g, ''))))} mins`;
                                              }
                                              return 'Time varies';
                                            })()
                                          ) : (
                                            'No options'
                                          )}
                                        </div>
                                        <div className="text-[14px] text-black mb-1 line-clamp-1">{service.description || 'No description available.'}</div>
                                        <div className="text-[16px] text-black font-normal mt-auto">from {service.price}</div>
                                      </div>
                                      <button
                                        className={`p-1 rounded-[5px] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-green-800)] flex-shrink-0 ${
                                          isSelected
                                            ? 'bg-[var(--color-primary-dark)] text-white hover:bg-[#002a1f]'
                                            : 'bg-black/5 text-gray-400 hover:bg-gray-100'
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          if (isSelected) {
                                            removeService(service.id);
                                          } else {
                                            handleServiceClick(service);
                                          }
                                        }}
                                        type="button"
                                        aria-label={isSelected ? `Remove ${service.name}` : `Select ${service.name}`}
                                      >
                                        {isSelected ? (
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                          </svg>
                                        ) : (
                                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                          </svg>
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                  <div
                                    id={`service-desc-${service.id}`}
                                    className="sr-only"
                                  >
                                    {service.name} service, price {service.price}, options: {service.options.join(', ')}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
                })()}
              </div>
            </fieldset>
          </div>

          {/* Right Column - Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-30 fixed bottom-0 left-0 right-0 bg-white p-6 lg:relative lg:border lg:border-black/30">
              {/* Business Info */}
              <div className="mb-6 hidden lg:block">
                <h3 className="text-lg font-bold text-green-800 mb-2">Vy Brows Academy</h3>
                <p className="text-sm text-gray-600 mb-1">13192 Bellaire Boulevard, B</p>
                <p className="text-sm text-gray-600">Alief, Houston, Texas</p>
              </div>

              {/* Selected Services */}
              {selectedServices.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-green-800 mb-3">Selected Services ({selectedServices.length})</h4>
                  <div className="space-y-3">
                    {selectedServices.map((service, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{service.name}</p>
                          <p className="text-xs text-gray-600">{booking.options[service.id] || 'No option selected'}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-green-800">
                            {(() => {
                              const selectedOptionName = booking.options[service.id];
                              const selectedOption = service.options.find((opt: any) => opt.name === selectedOptionName);
                              return selectedOption?.price || service.price;
                            })()}
                          </p>
                          <button
                            onClick={() => removeService(service.id)}
                            className="text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                            type="button"
                            aria-label={`Remove ${service.name}`}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              {selectedServices.length > 0 && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-green-800">Total</span>
                    <span className="font-bold text-lg text-green-800">${total}</span>
                  </div>
                </div>
              )}

              {/* Continue Button */}
              <button
                className={`w-full px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2 ${
                  selectedServices.length > 0
                    ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={onNext}
                type="button"
                disabled={selectedServices.length === 0}
                aria-describedby="step-1-help"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div id="step-1-help" className="sr-only">
            Proceed to step 2 to select your preferred date and time
          </div>

          {/* Popup for Service Selection */}
          {/* Removed - services are now selected directly */}
        </div>
      </main>
    </div>
  );
};

export default Step1ServiceSelection;
