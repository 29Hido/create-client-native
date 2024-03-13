import { configureStore } from '@reduxjs/toolkit';
import bookSlice from './slices/bookSlice';
import { bookApi } from './api/bookApi';

export const makeStore = () => {
    return configureStore({
        reducer: {
            book: bookSlice,
            [bookApi.reducerPath]: bookApi.reducer,
        },
        middleware: getDefaultMiddleware =>
            getDefaultMiddleware()
                .concat(bookApi.middleware),
    });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

