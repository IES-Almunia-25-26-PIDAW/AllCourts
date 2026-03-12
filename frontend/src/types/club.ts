export interface Club {
  id: number;
  manager_id: number;
  name: string;
  address: string;
  city: string;
  logo_url: string;
  description: string;
  created_at?: string;
}

export interface CreateClubDTO {
  manager_id: number;
  name: string;
  address: string;
  city: string;
  logo_url: string;
  description: string;
}

export interface UpdateClubDTO {
  name?: string;
  address?: string;
  city?: string;
  logo_url?: string;
  description?: string;
}
