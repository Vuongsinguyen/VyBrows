// Step2DateTime.tsx - Date and time slot selection
import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { BookingState } from '../../types/booking';
import { SERVICE_CATEGORIES } from '../UI/BookingComponent';

interface Step2Props {
  booking: BookingState;
  updateBooking: (updates: Partial<BookingState>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface TimeSlot {
  time: string;
  available: boolean;
  disabled?: boolean;
}

const Step2DateTime: React.FC<Step2Props> = ({
  booking,
  updateBooking,
  onNext,
  onPrevious
}) => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(booking.date || '');
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [numDays, setNumDays] = useState(60); // Số ngày hiển thị ban đầu
  const [isLoading, setIsLoading] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(''); // Track visible month
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastDateRef = useRef<HTMLDivElement | null>(null);
  const monthObserverRef = useRef<IntersectionObserver | null>(null);

  // Fetch available dates from API on mount
  useEffect(() => {
    fetch('/.netlify/functions/getAvailableDates')
      .then(res => res.json())
      .then(data => {
        setAvailableDates(data.availableDates || []);
      })
      .catch(() => {
        // If API fails, allow all dates to be selectable
        setAvailableDates([]);
      });
  }, []);

  // Generate time slots for a given date
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    // Generate time slots from 10:00 AM to 5:00 PM, skipping 12:00 PM
    for (let hour = 10; hour <= 17; hour++) {
      if (hour !== 12) {
        const timeString = `${hour.toString().padStart(2, '0')}:00`;
        slots.push({
          time: timeString,
          available: true,
          disabled: false
        });
      }
    }

    return slots;
  };

  // Generate time slots based on selected date
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
    }
    if (selectedDate) {
      fetch(`/.netlify/functions/getAvailableTimes?date=${selectedDate}`)
        .then(res => res.json())
        .then(data => {
          const bookedTimes: string[] = data.bookedTimes || [];
          // Nếu không có giờ nào bị đặt thì hiển thị tất cả khung giờ
          if (bookedTimes.length === 0) {
            setTimeSlots(generateTimeSlots(selectedDate));
          } else {
            const slots = generateTimeSlots(selectedDate).map(slot => ({
              ...slot,
              available: !bookedTimes.includes(slot.time),
              disabled: bookedTimes.includes(slot.time)
            }));
            setTimeSlots(slots);
          }
        })
        .catch(() => {
          // If API fails, show all time slots as available
          setTimeSlots(generateTimeSlots(selectedDate));
        });
    }
  }, [selectedDate]);
  const getDateList = (): { iso: string; day: string; date: number; month: string }[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const list = [];
    const today = new Date();
    for (let i = 0; i < numDays; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      list.push({
        iso,
        day: days[d.getDay()],
        date: d.getDate(),
        month: months[d.getMonth()]
      });
    }
    return list;
  };

  // Handle date selection
  const handleDateSelect = (iso: string) => {
    // Allow selection if availableDates is empty (no restrictions) or if date is in availableDates
    if (availableDates.length > 0 && !availableDates.includes(iso)) return;
    setSelectedDate(iso);
    updateBooking({ date: iso, time: '' });
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    updateBooking({ time });
  };



  // Handle scroll to load more dates
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isLoading) return;
    
    const target = e.currentTarget;
    const scrollLeft = target.scrollLeft;
    const scrollWidth = target.scrollWidth;
    const clientWidth = target.clientWidth;
    
    // Check if scrolled to within 50px of the end
    if (scrollLeft + clientWidth >= scrollWidth - 50) {
      console.log('Loading more days...', { scrollLeft, scrollWidth, clientWidth });
      setIsLoading(true);
      setTimeout(() => {
        setNumDays(prev => {
          console.log('Adding 10 more days, current:', prev);
          return prev + 10;
        });
        setIsLoading(false);
      }, 100);
    }
  }, [isLoading]);

  // Setup Intersection Observer for infinite scroll
  useEffect(() => {
    const loadMoreDays = () => {
      if (!isLoading) {
        console.log('Intersection Observer: Loading more days...');
        setIsLoading(true);
        setTimeout(() => {
          setNumDays(prev => {
            console.log('Adding 10 more days via observer, current:', prev);
            return prev + 10;
          });
          setIsLoading(false);
        }, 100);
      }
    };

    if (lastDateRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            loadMoreDays();
          }
        },
        { threshold: 0.1, rootMargin: '20px' }
      );

      observerRef.current.observe(lastDateRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [numDays, isLoading]);

  // Setup month visibility observer
  useEffect(() => {
    const today = new Date();
    const currentMonth = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][today.getMonth()];
    const currentYear = today.getFullYear().toString();
    setVisibleMonth(`${currentMonth} ${currentYear}`);

    // Observer for tracking visible month
    monthObserverRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const monthYear = entry.target.getAttribute('data-month-year');
            if (monthYear) {
              setVisibleMonth(monthYear);
            }
          }
        });
      },
      { threshold: 0.5, root: null }
    );

    return () => {
      if (monthObserverRef.current) {
        monthObserverRef.current.disconnect();
      }
    };
  }, []);

  const isFormValid = selectedDate && booking.time;

  // Get selected services and calculate total (same logic as Step1)
  const getSelectedServices = (): any[] => {
    const services: any[] = [];
    for (const serviceId of booking.services) {
      for (const category of SERVICE_CATEGORIES) {
        for (const group of category.groups) {
          const service = group.services.find((s: any) => s.id === serviceId);
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
  const total = selectedServices.reduce((sum: number, service: any) => {
    const selectedOptionName = booking.options[service.id];
    const selectedOption = service.options?.find((opt: any) => opt.name === selectedOptionName);
    const priceStr = selectedOption?.price || service.price;
    return sum + parseFloat((priceStr || '0').replace(/[^\d.]/g, ''));
  }, 0);

  return (
    <div
      role="tabpanel"
      aria-labelledby="step-2-title"
      tabIndex={0}
      className="w-full flex justify-center"
      style={{ paddingLeft: 20, paddingRight: 20 }}
    >
  <div className="flex flex-col md:flex-row gap-8 w-full max-w-[1330px]">
        {/* Left: Date/Time Picker */}
  <div className="flex-1 md:pr-4 min-w-0">
          <div className="w-full mx-auto">
            {/* Date Picker UI */}
            <div className="mb-8">
              {/* Month title above date picker */}
              <div className="w-full flex gap-4 items-center mb-2 pl-2">
                <span className="text-lg font-bold text-green-800">{visibleMonth}</span>
              </div>
              <div
                className="w-full max-w-full overflow-x-auto scrollbar-thin scrollbar-thumb-green-200 scrollbar-track-green-50"
                style={{ WebkitOverflowScrolling: 'touch' }}
              >
                <div className="flex gap-4 pb-2 min-w-max" style={{height: '160px'}}>
                  {(() => {
                    // Show numDays days in the future
                    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
                    const today = new Date();
                    let lastMonth = '';
                    let lastYear = '';
                    const list = [];
                    for (let i = 0; i < numDays; i++) {
                      const d = new Date(today);
                      d.setDate(today.getDate() + i);
                      const month = monthsFull[d.getMonth()];
                      const year = d.getFullYear().toString();
                      if (month !== lastMonth || year !== lastYear) {
                        // Month marker for scroll logic (not rendered here)
                        lastMonth = month;
                        lastYear = year;
                      }
                      list.push({
                        iso: d.toISOString().split('T')[0],
                        day: days[d.getDay()],
                        date: d.getDate(),
                        month: months[d.getMonth()],
                        monthFull: month,
                        year
                      });
                    }
                    return list.map((date, index) => {
                      const monthYear = `${date.monthFull} ${date.year}`;
                      return (
                        <div
                          key={date.iso}
                          ref={(el) => {
                            if (index === list.length - 1) {
                              lastDateRef.current = el;
                            }
                            if (el && monthObserverRef.current) {
                              el.setAttribute('data-month-year', monthYear);
                              monthObserverRef.current.observe(el);
                            }
                          }}
                          data-item="true"
                          data-iso-date={date.iso}
                          data-selected={selectedDate === date.iso}
                          data-month-year={monthYear}
                          className={`Time_tileWrapper___wF4w transition-opacity duration-300 flex flex-col items-center ${selectedDate === date.iso ? 'opacity-100' : 'opacity-80'}`}
                        >
                        <button
                          className={`bXw7YC _XdG-5 util-focusRing-overrides _0HRZT5 eUzQQC OGOjGC flex flex-col items-center justify-center w-16 h-16 rounded-full border font-bold text-base transition-all duration-200 ${
                            selectedDate === date.iso
                              ? 'bg-green-800 text-white border-green-800 shadow-lg'
                              : 'bg-white text-gray-800 border-gray-300 hover:bg-green-50'
                          }`}
                          type="button"
                          aria-pressed={selectedDate === date.iso}
                          aria-label={`Select ${date.day}, ${date.date} ${date.month}`}
                          onClick={() => handleDateSelect(date.iso)}
                        >
                          <div className={`h_sbuC OGOjGC xa-FjC ${selectedDate === date.iso ? 'njpOjC' : ''}`}> 
                            <p aria-hidden="true" className="_-wKJIN font-default-header-m-semibold BVXG1C xa-FjC text-lg">{date.date}</p>
                          </div>
                        </button>
                        <p aria-hidden="true" className="_-wKJIN font-default-body-s-medium _0wX0lC xa-FjC text-xs mt-1">{date.day}</p>
                      </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* Time Slots UI */}
            {selectedDate && (
              <div className="mb-8">
                <div className="flex flex-col gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      className={`w-full text-left py-4 px-6 rounded-lg border transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                        booking.time === slot.time
                          ? 'bg-green-800 text-white border-green-800'
                          : slot.available && !slot.disabled
                          ? 'bg-white text-gray-800 border-gray-300 hover:bg-green-50'
                          : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                      }`}
                      onClick={() => slot.available && !slot.disabled && handleTimeSelect(slot.time)}
                      disabled={!slot.available || slot.disabled}
                      type="button"
                      aria-selected={booking.time === slot.time}
                      aria-label={`Select ${slot.time}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div> {/* <-- Proper closing for left column content */}
        </div>
        {/* Right: Summary/Total Info + Continue Button */}
  <div className="md:w-[340px] md:min-w-[300px] md:max-w-[400px] w-full mb-8 md:mb-0 min-w-0">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg sticky md:top-24 flex flex-col gap-4">
            <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
            <div className="text-green-700 space-y-1 mb-2">
              {selectedDate && booking.time && (
                <div className="mb-2">
                  <span className="font-semibold">Date & Time:</span>
                  <span className="ml-2">
                    {new Date(selectedDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })} at {booking.time}
                  </span>
                </div>
              )}
              {selectedServices.length === 0 ? (
                <p className="text-sm">No services selected.</p>
              ) : (
                selectedServices.map((service, idx) => {
                  const selectedOptionName = booking.options[service.id];
                  const selectedOption = service.options?.find((opt: any) => opt.name === selectedOptionName);
                  return (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span>
                        {service.name}
                        {selectedOptionName ? ` (${selectedOptionName})` : ''}
                      </span>
                      <span className="ml-2 font-medium">
                        {selectedOption?.price || service.price}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            <div className="border-t border-green-200 pt-2 mt-2 flex justify-between text-green-900 font-bold text-lg">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            {/* Continue Button inside summary box */}
            <button
              className={`w-full mt-4 px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                isFormValid
                  ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              onClick={onNext}
              type="button"
              disabled={!isFormValid}
              aria-describedby="step-2-help"
            >
              Continue
            </button>
            <div id="step-2-help" className="sr-only">
              Proceed to step 3 to enter your personal information
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2DateTime;