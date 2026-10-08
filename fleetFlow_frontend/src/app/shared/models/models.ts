export interface AuthRequest { username: string; password: string; }
export interface AuthResponse { token: string; role: string; username: string; }
export interface RegisterRequest { username: string; password: string; role: string; email: string; fullName: string; }

export interface Warehouse {
  warehouseId?: number;
  warehouseName: string;
  location: string;
  capacity: number;
  managerName: string;
  contactNumber: string;
  email?: string;
  address?: string;
  activeVehicles?: number;
  totalTrips?: number;
  vehicles?: Vehicle[];
}

export interface Vehicle {
  vehicleId?: number;
  vehicleNumber: string;
  vehicleType: string;
  manufacturer: string;
  modelYear: number;
  fuelType: string;
  currentStatus: string;
  capacity?: number;
  description?: string;
  totalTrips?: number;
  totalDistance?: number;
  warehouse?: Warehouse;
}

export interface Driver {
  driverId?: number;
  username?: string;
  warehouseId?: number;
  driverName: string;
  licenseNumber: string;
  phoneNumber: string;
  emailId: string;
  experience: number;
  licenseExpiryDate: string;
  address?: string;
  dateOfBirth?: string;
  totalTrips?: number;
  totalDistance?: number;
  rating?: number;
  available?: boolean;
}

export interface Trip {
  tripId?: number;
  startDate: string;
  endDate?: string;
  sourceLocation: string;
  destinationLocation: string;
  distanceCovered: number;
  tripStatus: string;
  revenue?: number;
  fuelConsumed?: number;
  notes?: string;
  purpose?: string;
  vehicle?: Vehicle;
  driver?: Driver;
  maintenanceRecord?: MaintenanceRecord;
}

export interface MaintenanceRecord {
  maintenanceId?: number;
  maintenanceDate: string;
  serviceType: string;
  cost: number;
  notes?: string;
  nextServiceDate?: string;
  performedBy?: string;
  status?: string;
  laborCost?: number;
  partsCost?: number;
  trip?: Trip;
}
