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

export const DAY_KEYS: Record<DayOfWeek, string> = {
  0: 'days.sunday',
  1: 'days.monday',
  2: 'days.tuesday',
  3: 'days.wednesday',
  4: 'days.thursday',
  5: 'days.friday',
  6: 'days.saturday'
};
