// store
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../features/rootReducer"
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';


const persistConfig = {
    key: 'root',
    storage,
    whitelist: ['auth', 'request'],
    onError: (error) => {
        console.error('Persistence error:', error);
      },
    
  };


const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
      }),    
});

export default store;

export const persistor = persistStore(store);
