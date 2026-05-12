export type SurfaceType =
  | "tierra_batida"
  | "cesped_natural"
  | "cesped_artificial"
  | "dura"
  | "arena"
  | "parque";

export type Sport =
  | "tenis"
  | "padel"
  | "pickleball"
  | "baloncesto_3x3"
  | "baloncesto_5x5"
  | "futbol_5"
  | "futbol_7"
  | "futbol_11"
  | "voley"
  | "balonmano";

export const SURFACE_LABELS: Record<SurfaceType, string> = {
  tierra_batida: "Tierra batida",
  cesped_natural: "Césped natural",
  cesped_artificial: "Césped artificial",
  dura: "Superficie dura",
  arena: "Arena",
  parque: "Parque",
};

export const SPORT_LABELS: Record<Sport, string> = {
  tenis: "Tenis",
  padel: "Pádel",
  pickleball: "Pickleball",
  baloncesto_3x3: "Baloncesto 3×3",
  baloncesto_5x5: "Baloncesto 5×5",
  futbol_5: "Fútbol 5",
  futbol_7: "Fútbol 7",
  futbol_11: "Fútbol 11",
  voley: "Vóley",
  balonmano: "Balonmano",
};

export interface Court {
  id: number;
  club_id: number;
  name: string;
  surface_type: SurfaceType;
  sport: Sport;
  price_60: number;
  price_90: number;
  price_120: number;
  min_unit_min: number;
  image_url: string;
  description: string;
  is_indoor: boolean;
  created_at?: string;
}

export interface CourtWithClub extends Court {
  club_name?: string;
  address?: string;
  city?: string;
  logo_url?: string;
}

export interface CreateCourtDTO {
  club_id: number;
  name: string;
  surface_type: SurfaceType;
  sport: Sport;
  price_60: number;
  price_90: number;
  price_120: number;
  min_unit_min?: number;
  image_url: string;
  description: string;
  is_indoor?: boolean;
}

export interface UpdateCourtDTO {
  name?: string;
  surface_type?: SurfaceType;
  sport?: Sport;
  price_60?: number;
  price_90?: number;
  price_120?: number;
  min_unit_min?: number;
  image_url?: string;
  description?: string;
  is_indoor?: boolean;
}
