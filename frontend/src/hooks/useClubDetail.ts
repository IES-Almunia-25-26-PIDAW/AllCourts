import { useCallback } from "react";
import { getClubById } from "@/api/clubApi";
import type { ClubWithManager } from "@/types/club";
import { useAsyncResource } from "./useAsyncResource";

export function useClubDetail(clubId?: string) {
	const loadClub = useCallback(async () => {
		if (!clubId) {
			throw new Error("No se encontró el club.");
		}

		return getClubById(clubId);
	}, [clubId]);

	const { data, loading, error } = useAsyncResource<ClubWithManager>(loadClub, Boolean(clubId));

	return {
		club: data,
		loading,
		error,
	};
}