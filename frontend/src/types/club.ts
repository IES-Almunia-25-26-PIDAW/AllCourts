export interface Club {
  id: number;
  manager_id: string;
  name: string;
  address: string;
  city: string;
  logo_url: string;
  description: string;
  created_at?: string;
}

export interface ClubWithManager extends Club {
  manager_name?: string;
  manager_email?: string;
}

export interface CreateClubDTO {
  manager_id: string;
  name: string;
  address: string;
  city: string;
  logo_url: string;
  description?: string;
}

export interface UpdateClubDTO {
  name?: string;
  address?: string;
  city?: string;
  logo_url?: string;
  description?: string;
}
