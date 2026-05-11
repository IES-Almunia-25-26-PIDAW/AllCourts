import { useCallback } from "react";
import { getClubs } from "@/api/clubApi";
import type { ClubWithManager } from "@/types/club";
import { useAsyncResource } from "./useAsyncResource";

export function useClubs() {
	const loadClubs = useCallback(async () => {
		return getClubs();
	}, []);

	const { data, loading, error } = useAsyncResource<ClubWithManager[]>(loadClubs);

	return {
		clubs: data ?? [],
		loading,
		error,
	};
}