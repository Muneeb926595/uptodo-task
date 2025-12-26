import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FocusState } from '../state';

const initialState: FocusState = {
  isActive: false,
  duration: 1800, // 30 minutes default
  startTime: null,
  endTime: null,
  notificationsSuppressed: false,
};

const focusSlice = createSlice({
  name: 'focus',
  initialState,
  reducers: {
    startFocusMode: (
      state,
      action: PayloadAction<{
        duration: number;
        startTime: number;
        endTime: number;
      }>,
    ) => {
      state.isActive = true;
      state.duration = action.payload.duration;
      state.startTime = action.payload.startTime;
      state.endTime = action.payload.endTime;
      state.notificationsSuppressed = true;
    },
    stopFocusMode: state => {
      state.isActive = false;
      state.startTime = null;
      state.endTime = null;
      state.notificationsSuppressed = false;
    },
    updateDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setNotificationsSuppressed: (state, action: PayloadAction<boolean>) => {
      state.notificationsSuppressed = action.payload;
    },
  },
});

export const {
  startFocusMode,
  stopFocusMode,
  updateDuration,
  setNotificationsSuppressed,
} = focusSlice.actions;

export default focusSlice.reducer;
