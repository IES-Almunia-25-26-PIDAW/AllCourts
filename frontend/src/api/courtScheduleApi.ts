import { request } from "@/api/http";
import type { CourtSchedule } from "@/types/courtSchedule";

export async function getCourtSchedulesByCourtId(
	courtId: string | number,
): Promise<CourtSchedule[]> {
	return request<CourtSchedule[]>(`/court-schedules/court/${courtId}`);
}
