import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import * as managerApi from "@/api/managerApi";
import type { RootState } from "@/store";
import type { Manager, UpdateManagerDTO } from "@/types/manager";
import type { ManagerStats } from "@/types/manager";
import type { Court } from "@/types/court";
import type { Club } from "@/types/club";
import type { Booking } from "@/types/booking";

type ManagerState = {
  manager: Manager | null;
  stats: ManagerStats | null;
  courts: Court[];
  clubs: Club[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
};

const initialState: ManagerState = {
  manager: null,
  stats: null,
  courts: [],
  clubs: [],
  bookings: [],
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
  async ({ managerId, data }: { managerId: string; data: UpdateManagerDTO }) => {
    await managerApi.updateSubscription(managerId, data);
    return { managerId, data };
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
      .addCase(fetchManagerData.fulfilled, (state, action: PayloadAction<Manager>) => {
        state.manager = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagerData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to load manager";
      })

      .addCase(fetchManagerStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerStats.fulfilled, (state, action: PayloadAction<ManagerStats>) => {
        state.stats = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagerStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to load stats";
      })

      .addCase(fetchManagerCourts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerCourts.fulfilled, (state, action: PayloadAction<Court[]>) => {
        state.courts = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagerCourts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to load courts";
      })

      .addCase(fetchManagerClubs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerClubs.fulfilled, (state, action: PayloadAction<Club[]>) => {
        state.clubs = action.payload;
        state.loading = false;
      })
      .addCase(fetchManagerClubs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to load clubs";
      })

      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action: PayloadAction<Booking[]>) => {
        state.bookings = action.payload;
        state.loading = false;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to load bookings";
      })

      .addCase(updateManagerSubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateManagerSubscription.fulfilled, (state, action) => {
        state.loading = false;
        if (state.manager) {
          state.manager = { ...state.manager, ...action.payload.data };
        }
      })
      .addCase(updateManagerSubscription.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? "Failed to update subscription";
      });
  },
});

export const { clearManagerState } = managerSlice.actions;

export const selectManager = (state: RootState) => state.manager.manager;
export const selectManagerStats = (state: RootState) => state.manager.stats;
export const selectManagerCourts = (state: RootState) => state.manager.courts;
export const selectManagerClubs = (state: RootState) => state.manager.clubs;
export const selectManagerBookings = (state: RootState) => state.manager.bookings;
export const selectManagerLoading = (state: RootState) => state.manager.loading;

export default managerSlice.reducer;
