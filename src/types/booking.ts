// Types for booking system
export interface BookingState {
  step: number;
  category: string;
  service: string;
  option: string;
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  age: number | string;
  specialRequests?: string;
}

export interface Service {
  name: string;
  price: string;
  options: string[];
  duration?: string;
  description?: string;
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

export interface BookingComponentProps {
  booking: BookingState;
  onBookingChange: (field: keyof BookingState, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  onSubmit?: () => void;
}