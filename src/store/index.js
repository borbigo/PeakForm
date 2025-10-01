import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import workoutReducer from './slices/workoutSlice';
import socialReducer from './slices/socialSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workouts: workoutReducer,
    social: socialReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, //for date objects in workouts
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispath = typeof store.dispatch;