import { useCallback } from "react";
import { getCourtById } from "@/api/courtApi";
import type { CourtWithClub } from "@/types/court";
import { useAsyncResource } from "./useAsyncResource";

export function useCourtDetail(courtId?: string) {
	const loadCourt = useCallback(async () => {
		if (!courtId) {
			throw new Error("No se encontró la pista.");
		}

		return getCourtById(courtId);
	}, [courtId]);

	const { data, loading, error } = useAsyncResource<CourtWithClub>(loadCourt, Boolean(courtId));

	return {
		court: data,
		loading,
		error,
	};
}