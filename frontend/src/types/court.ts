export type SurfaceType = 'tierra_batida' | 'cesped_natural' | 'cesped_artificial' | 'dura' | 'arena' | 'parque';

export type Sport =
  | 'tenis'
  | 'padel'
  | 'pickleball'
  | 'baloncesto_3x3'
  | 'baloncesto_5x5'
  | 'futbol_5'
  | 'futbol_7'
  | 'futbol_11'
  | 'voley'
  | 'balonmano';

export const SURFACE_LABELS: Record<SurfaceType, string> = {
  tierra_batida: 'courts.surface_tierra_batida',
  cesped_natural: 'courts.surface_cesped_natural',
  cesped_artificial: 'courts.surface_cesped_artificial',
  dura: 'courts.surface_dura',
  arena: 'courts.surface_arena',
  parque: 'courts.surface_parque'
};

export const SPORT_LABELS: Record<Sport, string> = {
  tenis: 'courts.sport_tenis',
  padel: 'courts.sport_padel',
  pickleball: 'courts.sport_pickleball',
  baloncesto_3x3: 'courts.sport_baloncesto_3x3',
  baloncesto_5x5: 'courts.sport_baloncesto_5x5',
  futbol_5: 'courts.sport_futbol_5',
  futbol_7: 'courts.sport_futbol_7',
  futbol_11: 'courts.sport_futbol_11',
  voley: 'courts.sport_voley',
  balonmano: 'courts.sport_balonmano'
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
