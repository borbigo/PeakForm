import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import workoutService from '../../services/workoutService';

export const fetchWorkouts = createAsyncThunk(
  'workouts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workoutService.getWorkouts();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch workouts');
    }
  }
);

export const createWorkout = createAsyncThunk(
  'workouts/create',
  async (workoutData, { rejectWithValue }) => {
    try {
      const response = await workoutService.createWorkout(workoutData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create workout');
    }
  }
);

export const deleteWorkout = createAsyncThunk(
  'workouts/delete',
  async (workoutId, { rejectWithValue }) => {
    try {
      await workoutService.deleteWorkout(workoutId);
      return workoutId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete workout');
    }
  }
);

const workoutSlice = createSlice({
  name: 'workouts',
  initialState: {
    workouts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWorkoutError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkouts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWorkouts.fulfilled, (state, action) => {
        state.loading = false;
        state.workouts = action.payload;
      })
      .addCase(fetchWorkouts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createWorkout.fulfilled, (state, action) => {
        state.workouts.unshift(action.payload);
      })
      .addCase(deleteWorkout.fulfilled, (state, action) => {
        state.workouts = state.workouts.filter(w => w.id !== action.payload);
      });
  },
});

export const { clearWorkoutError } = workoutSlice.actions;
export default workoutSlice.reducer;