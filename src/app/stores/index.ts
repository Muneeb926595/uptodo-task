// src/app/stores/index.ts
// Redux toolkit store : to only store frontend states
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../../modules/auth/store/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// How to decide if a state is going to be stored in redux or react query
// Redux manages the APP
// React Query manages the DATA

// 🟦 Use Redux Toolkit for (App State)

// Store things that define how the app behaves.

// ✅ Put in Redux if the data:
// 	•	Controls navigation / access
// 	•	Represents identity or session
// 	•	Must exist before any API call
// 	•	Should NOT refetch automatically
// 	•	Should NOT be garbage-collected
// 	•	Is mostly synchronous
// 	•	Is global UI or app configuration

// 🧩 Examples
// 	•	Auth session (user, isAuthenticated)
// 	•	User role / permissions
// 	•	Modal & bottom sheet state
//   •	Filters, sorting options
// 	•	Theme, language, feature flags
// 	•	App settings
// 	•	Onboarding status
//   If losing this data breaks the app flow → Redux

//   🟩 Use React Query for (Server / Storage Data)

//     Formula
// Store things that represent content coming from a backend or storage.

// ✅ Put in React Query if the data:
// 	•	Comes from backend, database, MMKV, SQLite
// 	•	Can be refetched anytime
// 	•	Can be cached
// 	•	Can become stale
// 	•	Can be invalidated
// 	•	Can be synced (offline → online)
// 	•	Supports pagination, filtering, optimistic updates

// 🧩 Examples
// 	•	Todos
// 	•	Categories
//   •	Subtasks
// 	•	Calendar data
// 	•	Notifications list
// 	•	Attachments
// 	•	Remote config content

//   Formula
//   If data can be refetched or synced safely → React Query
