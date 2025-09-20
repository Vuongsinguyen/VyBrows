// Types for booking system
export interface BookingState {
  step: number;
  category: string;
  services: string[]; // Array of service IDs
  options: { [serviceId: string]: string }; // Options keyed by service ID
  date: string;
  time: string;
  fullName: string;
  phone: string;
  email: string;
  age: number | string;
  specialRequests?: string;
}

export interface Service {
  id: string;
  name: string;
  price: string;
  options: Array<{ name: string; time: string; price?: string }>; // Option name and time per option
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