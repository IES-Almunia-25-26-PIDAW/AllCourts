export interface Manager {
  id: number;
  user_id: number;
  subscription_active: boolean;
  subscription_start?: string;
  subscription_end?: string;
}

export interface CreateManagerDTO {
  user_id: number;
  subscription_active?: boolean;
  subscription_start?: string;
  subscription_end?: string;
}

export interface UpdateManagerDTO {
  subscription_active?: boolean;
  subscription_start?: string;
  subscription_end?: string;
}
