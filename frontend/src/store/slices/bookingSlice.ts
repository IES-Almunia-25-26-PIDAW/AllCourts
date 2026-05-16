import {
	createSlice,
	createAsyncThunk,
	type PayloadAction,
} from "@reduxjs/toolkit";
import * as bookingApi from "@/api/bookingApi";
import type { RootState } from "@/store";
import type {
	Booking,
	CreateBookingDTO,
	CreateBookingResponse,
	CourtAvailabilityResponse,
} from "@/types/booking";

type BookingState = {
	bookings: Booking[];
	availability: CourtAvailabilityResponse | null;
	lastCreated: CreateBookingResponse | null;
	loading: boolean;
	error: string | null;
};

const initialState: BookingState = {
	bookings: [],
	availability: null,
	lastCreated: null,
	loading: false,
	error: null,
};

export const fetchUserBookings = createAsyncThunk(
	"booking/fetchUserBookings",
	async (userId: string) => {
		return bookingApi.getBookingsByUserId(userId);
	},
);

export const createBooking = createAsyncThunk(
	"booking/createBooking",
	async (payload: CreateBookingDTO) => {
		return bookingApi.createBooking(payload);
	},
);

export const fetchCourtAvailability = createAsyncThunk(
	"booking/fetchCourtAvailability",
	async ({
		courtId,
		date,
		durationMin,
	}: {
		courtId: string | number;
		date: string;
		durationMin: number;
	}) => {
		return bookingApi.getCourtAvailability(courtId, date, durationMin);
	},
);

export const cancelBooking = createAsyncThunk(
	"booking/cancelBooking",
	async ({
		bookingId,
		cancelReason,
	}: {
		bookingId: number;
		cancelReason?: string;
	}) => {
		await bookingApi.cancelBooking(bookingId, cancelReason);
		return bookingId;
	},
);

const bookingSlice = createSlice({
	name: "booking",
	initialState,

	reducers: {
		clearAvailability: (state) => {
			state.availability = null;
		},
		clearLastCreated: (state) => {
			state.lastCreated = null;
		},
		clearBookingState: (state) => {
			state.bookings = [];
			state.availability = null;
			state.lastCreated = null;
			state.loading = false;
			state.error = null;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(fetchUserBookings.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchUserBookings.fulfilled,
				(state, action: PayloadAction<Booking[]>) => {
					state.bookings = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchUserBookings.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al cargar las reservas";
			})

			.addCase(createBooking.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				createBooking.fulfilled,
				(state, action: PayloadAction<CreateBookingResponse>) => {
					state.lastCreated = action.payload;
					state.loading = false;
				},
			)
			.addCase(createBooking.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al crear la reserva";
			})

			.addCase(fetchCourtAvailability.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				fetchCourtAvailability.fulfilled,
				(state, action: PayloadAction<CourtAvailabilityResponse>) => {
					state.availability = action.payload;
					state.loading = false;
				},
			)
			.addCase(fetchCourtAvailability.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ??
					"Error al consultar disponibilidad";
			})

			.addCase(cancelBooking.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(
				cancelBooking.fulfilled,
				(state, action: PayloadAction<number>) => {
					const bookingId = action.payload;
					const booking = state.bookings.find(
						(b) => b.id === bookingId,
					);
					if (booking) {
						booking.status = "cancelled";
					}
					state.loading = false;
				},
			)
			.addCase(cancelBooking.rejected, (state, action) => {
				state.loading = false;
				state.error =
					action.error?.message ?? "Error al cancelar la reserva";
			});
	},
});

export const { clearAvailability, clearLastCreated, clearBookingState } =
	bookingSlice.actions;

export const selectBookings = (state: RootState) => state.booking.bookings;
export const selectAvailability = (state: RootState) =>
	state.booking.availability;
export const selectLastCreated = (state: RootState) =>
	state.booking.lastCreated;
export const selectBookingLoading = (state: RootState) => state.booking.loading;
export const selectBookingError = (state: RootState) => state.booking.error;

export default bookingSlice.reducer;
