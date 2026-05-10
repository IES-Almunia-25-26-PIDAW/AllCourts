import { request } from "@/api/http";
import type { Manager, UpdateManagerDTO } from "@/types/manager";
import type { ManagerStats } from "@/types/manager";
import type { Club } from "@/types/club";
import type { Court } from "@/types/court";
import type { Booking } from "@/types/booking";

export async function getManagerByUserId(userId: string): Promise<Manager> {
  return request<Manager>(`/managers/user/${userId}`);
}

export async function getManagerStats(managerId: string): Promise<ManagerStats> {
  return request<ManagerStats>(`/managers/${managerId}/stats`);
}

export async function getManagerCourts(managerId: string): Promise<Court[]> {
  return request<Court[]>(`/managers/${managerId}/courts`);
}

export async function getManagerClubs(managerId: string): Promise<Club[]> {
  return request<Club[]>(`/clubs/manager/${managerId}`);
}

export async function getAllBookings(): Promise<Booking[]> {
  return request<Booking[]>(`/bookings`);
}

export async function updateSubscription(
  managerId: string,
  data: UpdateManagerDTO,
): Promise<void> {
  await request<void>(`/managers/${managerId}/subscription`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}
