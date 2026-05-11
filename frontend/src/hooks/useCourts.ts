import { useCallback } from "react";
import { getCourts } from "@/api/courtApi";
import type { CourtWithClub } from "@/types/court";
import { useAsyncResource } from "./useAsyncResource";

export function useCourts() {
	const loadCourts = useCallback(async () => {
		return getCourts();
	}, []);

	const { data, loading, error } = useAsyncResource<CourtWithClub[]>(loadCourts);

	return {
		courts: data ?? [],
		loading,
		error,
	};
}