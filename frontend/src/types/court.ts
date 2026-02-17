export interface Court {
    id: number;
    manager_id: number;
    name: string;
    address: string;
    city: string;
    price_hour: number;
    surface_type: string;
    image_url: string;
    opening_time: string;
    closing_time: string;
    description: string;
    created_at?: string;
    updated_at?: string;
}

export interface CreateCourtDTO {
    manager_id: number;
    name: string;
    address: string;
    city: string;
    price_hour: number;
    surface_type: string;
    image_url: string;
    opening_time: string;
    closing_time: string;
    description: string;
}

export interface UpdateCourtDTO {
    name?: string;
    address?: string;
    city?: string;
    price_hour?: number;
    surface_type?: string;
    image_url?: string;
    opening_time?: string;
    closing_time?: string;
    description?: string;
}