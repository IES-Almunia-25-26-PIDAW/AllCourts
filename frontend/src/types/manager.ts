export interface Manager {
  id: string;
  subscription_active: boolean;
  subscription_start?: string;
  subscription_end?: string;
}

export interface CreateManagerDTO {
  id: string;
  subscription_active?: boolean;
  subscription_start?: string;
  subscription_end?: string;
}

export interface UpdateManagerDTO {
  subscription_active?: boolean;
  subscription_start?: string;
  subscription_end?: string;
}

export interface ManagerStats {
  total_courts: number;
  total_bookings: number;
  total_revenue: number;
}
