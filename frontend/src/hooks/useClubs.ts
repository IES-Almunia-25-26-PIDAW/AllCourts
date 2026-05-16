import { useCallback } from "react";
import { getClubs } from "@/api/clubApi";
import type { ClubWithManager } from "@/types/club";
import { useAsyncResource } from "./useAsyncResource";

/**
 * Carga el listado general de clubes.
 *
 * @returns {object} Clubes, estado de carga y error.
 */
export function useClubs() {
	const loadClubs = useCallback(async () => {
		return getClubs();
	}, []);

	const { data, loading, error } =
		useAsyncResource<ClubWithManager[]>(loadClubs);

	return {
		clubs: data ?? [],
		loading,
		error,
	};
}
