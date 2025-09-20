// Step2DateTime.tsx - Date and time slot selection
import React, { useState, useEffect } from 'react';
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

  // Generate time slots based on selected date
  useEffect(() => {
    if (selectedDate) {
      const slots = generateTimeSlots(selectedDate);
      setTimeSlots(slots);
    }
  }, [selectedDate]);

  // Generate available time slots for a given date
  const generateTimeSlots = (date: string): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const today = new Date();
    const selectedDateObj = new Date(date);
    const isToday = selectedDateObj.toDateString() === today.toDateString();
    const currentHour = today.getHours();

    // Business hours: 9 AM to 5 PM (last slot is 17:00)
    for (let hour = 9; hour <= 17; hour++) {
      // Skip past hours if it's today
      if (isToday && hour <= currentHour) {
        continue;
      }

      // Skip lunch hour (12-13)
      if (hour === 12) {
        continue;
      }

      const timeString = `${hour.toString().padStart(2, '0')}:00`;
      
      slots.push({
        time: timeString,
        available: true,
        disabled: false
      });
    }

    return slots;
  };


  // Generate a list of dates for the next 14 days
  const getDateList = (): { iso: string; day: string; date: number; month: string }[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const list = [];
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      list.push({
        iso: d.toISOString().split('T')[0],
        day: days[d.getDay()],
        date: d.getDate(),
        month: months[d.getMonth()]
      });
    }
    return list;
  };

  // Handle date selection
  const handleDateSelect = (iso: string) => {
    setSelectedDate(iso);
    updateBooking({ date: iso, time: '' });
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    updateBooking({ time });
  };



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
      className="p-0 md:p-6"
    >
      <h3 id="step-2-title" className="text-xl font-bold mb-6 text-center text-green-800">
        Select Date & Time
      </h3>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Left: Date/Time Picker */}
        <div className="flex-1 md:pr-4">
          {/* Date Picker UI */}
          <div className="mb-8">
            <div className="flex overflow-x-auto gap-4 pb-2">
              {getDateList().map(date => (
                <button
                  key={date.iso}
                  className={`flex flex-col items-center px-4 py-2 rounded-full border transition-all duration-200 min-w-[56px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                    selectedDate === date.iso ? 'bg-green-800 text-white border-green-800' : 'bg-white text-gray-800 border-gray-300 hover:bg-green-50'
                  }`}
                  onClick={() => handleDateSelect(date.iso)}
                  aria-selected={selectedDate === date.iso}
                  aria-label={`Select ${date.day}, ${date.date} ${date.month}`}
                >
                  <span className="text-lg font-bold">{date.date}</span>
                  <span className="text-xs">{date.day}</span>
                </button>
              ))}
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

          {/* Selected DateTime Display */}
          {selectedDate && booking.time && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800">Selected Date & Time:</h4>
              <p className="text-green-700">
                {new Date(selectedDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} at {booking.time}
              </p>
            </div>
          )}
        </div>
        {/* Right: Summary/Total Info + Continue Button */}
        <div className="md:w-[340px] md:min-w-[300px] md:max-w-[400px] w-full mb-8 md:mb-0">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg sticky md:top-24 flex flex-col gap-4">
            <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
            <div className="text-green-700 space-y-1 mb-2">
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