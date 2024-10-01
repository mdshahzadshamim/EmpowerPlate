// rootReducer
import { combineReducers } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import requestSlice from './requestSlice';

const rootReducer = combineReducers({
  auth: authSlice,
  request: requestSlice,
});

export default rootReducer;