export type ServiceType = 'ride' | 'delivery' | 'store' | 'provider';
export type PackageType = 'small' | 'medium' | 'large' | 'fragile';

export interface Vehicle {
  id: string;
  name: string;
  type: 'economy' | 'premium' | 'luxury' | 'van';
  pricePerKm: number;
  estimatedArrival: number; // in minutes
  capacity: number;
  image: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: ServiceType;
}

export interface Booking {
  id: string;
  type: ServiceType;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  origin: string;
  destination: string;
  price: number;
  date: string;
  vehicleId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  rating: number;
  balance: number;
  isElite: boolean;
}
