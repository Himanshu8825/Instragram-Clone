import { configureStore } from '@reduxjs/toolkit';
import authSlice from './Slices/authSlices';

const store = configureStore({
  reducer: {
    auth: authSlice,
  },
});

export default store;
