// Step2DateTime.tsx - Date and time slot selection
import React, { useState, useEffect } from 'react';
import type { BookingState } from './BookingComponent';

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

    // Business hours: 9 AM to 6 PM
    for (let hour = 9; hour <= 18; hour++) {
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

  // Handle date change
  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    updateBooking({ date: newDate, time: '' }); // Reset time when date changes
  };

  // Handle time selection
  const handleTimeSelect = (time: string) => {
    updateBooking({ time });
  };

  // Get minimum date (today)
  const getMinDate = (): string => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = (): string => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Check if weekend
  const isWeekend = (dateString: string): boolean => {
    const date = new Date(dateString);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday = 0, Saturday = 6
  };

  const isFormValid = selectedDate && booking.time;

  return (
    <div 
      role="tabpanel"
      aria-labelledby="step-2-title"
      tabIndex={0}
      className="p-6"
    >
      <h3 id="step-2-title" className="text-xl font-bold mb-6 text-center text-green-800">
        Select Date & Time
      </h3>

      {/* Selected Service Display */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <h4 className="font-semibold text-green-800">Selected Service:</h4>
        <p className="text-green-700">
          {booking.service} ({booking.option})
        </p>
      </div>

      {/* Date Selection */}
      <fieldset className="mb-8">
        <legend className="text-lg font-semibold mb-4 text-green-800">
          Select Date
        </legend>
        
        <div className="mb-4">
          <label htmlFor="booking-date" className="block text-sm font-medium text-gray-700 mb-2">
            Choose your preferred date:
          </label>
          <input
            type="date"
            id="booking-date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            min={getMinDate()}
            max={getMaxDate()}
            required
            className="w-full md:w-auto px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            aria-describedby="date-help"
          />
          <div id="date-help" className="text-sm text-gray-600 mt-2">
            Available dates: Today to {new Date(getMaxDate()).toLocaleDateString()}
            {selectedDate && isWeekend(selectedDate) && (
              <span className="block text-orange-600 font-medium mt-1">
                ⚠️ Weekend appointments may have limited availability
              </span>
            )}
          </div>
        </div>
      </fieldset>

      {/* Time Selection */}
      {selectedDate && (
        <fieldset className="mb-8">
          <legend className="text-lg font-semibold mb-4 text-green-800">
            Select Time
          </legend>
          
          <div 
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"
            role="radiogroup"
            aria-label="Available time slots"
            aria-describedby="time-help"
          >
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                className={`p-3 rounded-lg border-2 font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  booking.time === slot.time
                    ? 'border-green-600 bg-green-600 text-white'
                    : slot.available && !slot.disabled
                    ? 'border-gray-300 bg-white text-gray-700 hover:border-green-400 hover:bg-green-50'
                    : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                onClick={() => slot.available && !slot.disabled && handleTimeSelect(slot.time)}
                disabled={!slot.available || slot.disabled}
                type="button"
                role="radio"
                aria-checked={booking.time === slot.time}
                aria-describedby={`time-${slot.time.replace(':', '-')}-desc`}
              >
                {slot.time}
                <div 
                  id={`time-${slot.time.replace(':', '-')}-desc`}
                  className="sr-only"
                >
                  {slot.available && !slot.disabled 
                    ? `Available time slot at ${slot.time}`
                    : `Unavailable time slot at ${slot.time}`
                  }
                </div>
              </button>
            ))}
          </div>
          
          <div id="time-help" className="text-sm text-gray-600 mt-4">
            Business hours: 9:00 AM - 6:00 PM (Closed 12:00 PM - 1:00 PM for lunch)
            {timeSlots.length === 0 && selectedDate && (
              <span className="block text-red-600 font-medium mt-2">
                No available time slots for this date. Please select another date.
              </span>
            )}
          </div>
        </fieldset>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8">
        <button
          className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          onClick={onPrevious}
          type="button"
        >
          Previous: Select Service
        </button>
        
        <button
          className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
            isFormValid
              ? 'bg-green-800 text-white hover:bg-green-700 hover:transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          onClick={onNext}
          type="button"
          disabled={!isFormValid}
          aria-describedby="step-2-help"
        >
          Next: Personal Information
        </button>
      </div>
      
      <div id="step-2-help" className="sr-only">
        Proceed to step 3 to enter your personal information
      </div>

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
  );
};

export default Step2DateTime;