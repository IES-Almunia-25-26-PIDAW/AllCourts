export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6; 

export interface CourtSchedule {
  id: number;
  court_id: number;
  day_of_week: DayOfWeek;
  opening_time: string; 
  closing_time: string; 
  is_closed: boolean;
}

export interface CreateCourtScheduleDTO {
  court_id: number;
  day_of_week: DayOfWeek;
  opening_time: string;
  closing_time: string;
  is_closed?: boolean;
}

export interface UpdateCourtScheduleDTO {
  opening_time?: string;
  closing_time?: string;
  is_closed?: boolean;
}

export const DAY_LABELS: Record<DayOfWeek, string> = {
  0: "Domingo",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábado",
};
