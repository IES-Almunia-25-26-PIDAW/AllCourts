import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectUser } from "@/store/slices/authSlice";
import {
	fetchAllBookings,
	fetchManagerClubs,
	fetchManagerCourts,
	fetchManagerData,
	fetchManagerStats,
	selectManager,
	selectManagerBookings,
	selectManagerClubs,
	selectManagerCourts,
	selectManagerError,
	selectManagerLoading,
	selectManagerStats,
} from "@/store/slices/managerSlice";

export function useManagerDashboard() {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const user = useAppSelector(selectUser);
	const manager = useAppSelector(selectManager);
	const stats = useAppSelector(selectManagerStats);
	const courts = useAppSelector(selectManagerCourts);
	const clubs = useAppSelector(selectManagerClubs);
	const bookings = useAppSelector(selectManagerBookings);
	const loading = useAppSelector(selectManagerLoading);
	const error = useAppSelector(selectManagerError);

	useEffect(() => {
		if (!user) {
			return;
		}

		if (user.role !== "manager") {
			void router.replace("/clubs");
			return;
		}

		const loadDashboard = async () => {
			try {
				await dispatch(fetchManagerData(user.id)).unwrap();
				await Promise.all([
					dispatch(fetchManagerStats(user.id)),
					dispatch(fetchManagerCourts(user.id)),
					dispatch(fetchManagerClubs(user.id)),
					dispatch(fetchAllBookings()),
				]);
			} catch {
				// handled by the slice state
			}
		};

		void loadDashboard();
	}, [dispatch, router, user]);

	return {
		user,
		manager,
		stats,
		courts,
		clubs,
		bookings,
		loading,
		error,
		isManager: user?.role === "manager",
	};
}