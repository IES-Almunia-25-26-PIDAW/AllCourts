import * as clubApi from "@/api/clubApi";
import * as courtApi from "@/api/courtApi";
import * as courtScheduleApi from "@/api/courtScheduleApi";
import * as managerApi from "@/api/managerApi";
import type { RootState } from "@/store";
import type { Booking } from "@/types/booking";
import type { Club, CreateClubDTO, UpdateClubDTO } from "@/types/club";
import type { Court, CreateCourtDTO, UpdateCourtDTO } from "@/types/court";
import type { CourtSchedule, DayOfWeek } from "@/types/courtSchedule";
import type { Manager, ManagerStats, UpdateManagerDTO } from "@/types/manager";
import {
	createAsyncThunk,
	createSlice,
	type PayloadAction,
} from "@reduxjs/toolkit";

type ManagerState = {
	manager: Manager | null;
	stats: ManagerStats | null;
	courts: Court[];
	clubs: Club[];
	bookings: Booking[];
	schedulesByCourtId: Record<number, CourtSchedule[]>;
	loading: boolean;
	error: string | null;
};

const initialState: ManagerState = {
	manager: null,
	stats: null,
	courts: [],
	clubs: [],
	bookings: [],
	schedulesByCourtId: {},
	loading: false,
	error: null,
};

export const fetchManagerData = createAsyncThunk(
	"manager/fetchManagerData",
	async (userId: string) => {
		const manager = await managerApi.getManagerByUserId(userId);
		return manager;
	},
);

export const fetchManagerStats = createAsyncThunk(
	"manager/fetchManagerStats",
	async (managerId: string) => {
		return managerApi.getManagerStats(managerId);
	},
);

export const fetchManagerCourts = createAsyncThunk(
	"manager/fetchManagerCourts",
	async (managerId: string) => {
		return managerApi.getManagerCourts(managerId);
	},
);

export const fetchManagerClubs = createAsyncThunk(
	"manager/fetchManagerClubs",
	async (managerId: string) => {
		return managerApi.getManagerClubs(managerId);
	},
);

export const fetchAllBookings = createAsyncThunk(
	"manager/fetchAllBookings",
	async () => {
		return managerApi.getAllBookings();
	},
);

export const updateManagerSubscription = createAsyncThunk(
	"manager/updateSubscription",
	async ({
		managerId,
		data,
	}: {
		managerId: string;
		data: UpdateManagerDTO;
	}) => {
		await managerApi.updateSubscription(managerId, data);
		return { managerId, data };
	},
);

export const createClub = createAsyncThunk(
	"manager/createClub",
	async (data: CreateClubDTO) => {
		const createdClub = await clubApi.createClub(data);
		return clubApi.getClubById(createdClub.id);
	},
);

export const updateClub = createAsyncThunk(
	"manager/updateClub",
	async ({ id, data }: { id: number; data: UpdateClubDTO }) => {
		await clubApi.updateClub(id, data);
		return clubApi.getClubById(id);
	},
);

export const deleteClub = createAsyncThunk(
	"manager/deleteClub",
	async (id: number) => {
		await clubApi.deleteClub(id);
		return id;
	},
);

export const createCourt = createAsyncThunk(
	"manager/createCourt",
	async (data: CreateCourtDTO) => {
		const createdCourt = await courtApi.createCourt(data);
		return courtApi.getCourtById(createdCourt.id);
	},
);

export const updateCourt = createAsyncThunk(
	"manager/updateCourt",
	async ({ id, data }: { id: number; data: UpdateCourtDTO }) => {
		await courtApi.updateCourt(id, data);
		return courtApi.getCourtById(id);
	},
);

export const deleteCourt = createAsyncThunk(
	"manager/deleteCourt",
	async (id: number) => {
		await courtApi.deleteCourt(id);
		return id;
	},
);

export const fetchCourtSchedules = createAsyncThunk(
	"manager/fetchCourtSchedules",
	async (courtId: number) => {
		const schedules =
			await courtScheduleApi.getCourtSchedulesByCourtId(courtId);
		return { courtId, schedules };
	},
);

export const saveCourtSchedules = createAsyncThunk(
	"manager/saveCourtSchedules",
	async ({
		courtId,
		schedules,
	}: {
		courtId: number;
		schedules: {
			day_of_week: DayOfWeek;
			opening_time: string;
			closing_time: string;
			is_closed: boolean;
		}[];
	}) => {
		await courtScheduleApi.upsertBulkCourtSchedules(courtId, schedules);
		const updated =
			await courtScheduleApi.getCourtSchedulesByCourtId(courtId);
		return { courtId, schedules: updated };
	},
);

const managerSlice = createSlice({
	name: "manager",
	initialState,
	reducers: {
		clearManagerState: (state) => {
			state.manager = null;
			state.stats = null;
			state.courts = [];
			state.clubs = [];
			state.bookings = [];
			state.loading = false;
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchManagerData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchManagerData.fulfilled,
				(state, action: PayloadAction<Manager>) => {
					state.manager = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchManagerData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to load manager";
			})

			.addCase(fetchManagerStats.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchManagerStats.fulfilled,
				(state, action: PayloadAction<ManagerStats>) => {
					state.stats = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchManagerStats.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to load stats";
			})

			.addCase(fetchManagerCourts.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchManagerCourts.fulfilled,
				(state, action: PayloadAction<Court[]>) => {
					state.courts = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchManagerCourts.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to load courts";
			})

			.addCase(fetchManagerClubs.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchManagerClubs.fulfilled,
				(state, action: PayloadAction<Club[]>) => {
					state.clubs = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchManagerClubs.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Failed to load clubs";
			})

			.addCase(fetchAllBookings.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchAllBookings.fulfilled,
				(state, action: PayloadAction<Booking[]>) => {
					state.bookings = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchAllBookings.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Failed to load bookings";
			})

			.addCase(updateManagerSubscription.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateManagerSubscription.fulfilled, (state, action) => {
				state.loading = false;
				if (state.manager) {
					state.manager = {
						...state.manager,
						...action.payload.data,
					};
				}
			})
			.addCase(updateManagerSubscription.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Failed to update subscription";
			})

			.addCase(createClub.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createClub.fulfilled, (state, action) => {
				state.clubs.push(action.payload);
				state.loading = false;
			})
			.addCase(createClub.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Error al crear club";
			})

			.addCase(updateClub.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateClub.fulfilled, (state, action) => {
				const index = state.clubs.findIndex(
					(club) => club.id === action.payload.id,
				);
				if (index >= 0) {
					state.clubs[index] = action.payload;
				}
				state.loading = false;
			})
			.addCase(updateClub.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al actualizar club";
			})

			.addCase(deleteClub.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteClub.fulfilled, (state, action) => {
				state.clubs = state.clubs.filter(
					(club) => club.id !== action.payload,
				);
				state.loading = false;
			})
			.addCase(deleteClub.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Error al eliminar club";
			})

			.addCase(createCourt.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(createCourt.fulfilled, (state, action) => {
				state.courts.push(action.payload);
				state.loading = false;
			})
			.addCase(createCourt.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error?.message ?? "Error al crear pista";
			})

			.addCase(updateCourt.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(updateCourt.fulfilled, (state, action) => {
				const index = state.courts.findIndex(
					(court) => court.id === action.payload.id,
				);
				if (index >= 0) {
					state.courts[index] = action.payload;
				}
				state.loading = false;
			})
			.addCase(updateCourt.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al actualizar pista";
			})

			.addCase(deleteCourt.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(deleteCourt.fulfilled, (state, action) => {
				state.courts = state.courts.filter(
					(court) => court.id !== action.payload,
				);
				state.loading = false;
			})
			.addCase(deleteCourt.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al eliminar pista";
			})

			.addCase(fetchCourtSchedules.fulfilled, (state, action) => {
				state.schedulesByCourtId[action.payload.courtId] =
					action.payload.schedules;
			})
			.addCase(saveCourtSchedules.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(saveCourtSchedules.fulfilled, (state, action) => {
				state.schedulesByCourtId[action.payload.courtId] =
					action.payload.schedules;
				state.loading = false;
			})
			.addCase(saveCourtSchedules.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al guardar horarios";
			});
	},
});

export const { clearManagerState } = managerSlice.actions;

export const selectManager = (state: RootState) => state.manager.manager;
export const selectManagerStats = (state: RootState) => state.manager.stats;
export const selectManagerCourts = (state: RootState) => state.manager.courts;
export const selectManagerClubs = (state: RootState) => state.manager.clubs;
export const selectManagerBookings = (state: RootState) =>
	state.manager.bookings;
export const selectSchedulesByCourtId = (state: RootState) =>
	state.manager.schedulesByCourtId;
export const selectManagerLoading = (state: RootState) => state.manager.loading;
export const selectManagerError = (state: RootState) => state.manager.error;

export default managerSlice.reducer;
