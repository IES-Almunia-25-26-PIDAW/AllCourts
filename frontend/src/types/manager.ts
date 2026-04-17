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
