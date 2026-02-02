// Redux store configuration
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import jobReducer from './slices/job.slice';
import adminReducer from './slices/admin.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    admin: adminReducer,
  },
});
