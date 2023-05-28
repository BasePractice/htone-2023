// Файл содержит конфигурацию глобального стора redux-toolkit.
import {combineReducers, configureStore, PreloadedState} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {persistReducer, persistStore} from 'redux-persist';
import {FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE} from 'redux-persist/es/constants';
import storage from 'redux-persist/lib/storage';
import {alertSlice} from '../../common/alert/alertSlice';
import {authSlice} from '../../pages/auth/authSlice';
import {IAuthSession} from '../../pages/auth/types';
import {companiesSlice} from '../../pages/companies/companiesSlice';
import {platformsSlice} from '../../pages/platforms/platformsSlice';
import {IUser} from '../../pages/users/types';
import {userSlice} from '../../pages/users/userSlice';
import {usersListSlice} from '../../pages/users/usersListSlice';
import {rtkQueryErrorLoggerMiddleware} from '../api/apiMiddleware';
import {apiSlice} from '../api/apiSlice';

/**
 * настройка localstorage для хранения сессии
 */
const persistConfigSession = {
    key: 'session',
    storage,
    blacklist: [
        apiSlice.reducerPath,
    ],
};
/**
 * настройка localstorage для хранения пользователя
 */
const persistConfigUser = {
    key: 'user',
    storage,
    blacklist: [
        apiSlice.reducerPath,
    ],
};


const reducer = combineReducers({
    [apiSlice.reducerPath]: apiSlice.reducer,
    authSession: persistReducer<IAuthSession, any>(persistConfigSession, authSlice.reducer),
    alert: alertSlice.reducer,
    user: persistReducer<IUser, any>(persistConfigUser, userSlice.reducer),
    platformsList: platformsSlice.reducer,
    companiesList: companiesSlice.reducer,
    usersList: usersListSlice.reducer
});

export const setupStore = (preloadedState?: PreloadedState<any>) =>
    configureStore({
        reducer,
        preloadedState,
        devTools: process.env.NODE_ENV !== 'production',
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({
                serializableCheck: {
                    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // настройки для redux persist
                },
            }).concat(
                apiSlice.middleware,
                rtkQueryErrorLoggerMiddleware
            )
    });

export const store = setupStore();

// Infer the `RootState` and `AppDispatch` types from the store itself
export type TRootState = ReturnType<typeof store.getState>;

export type TAppStore = ReturnType<typeof setupStore>;

export type TAppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => TAppDispatch = useDispatch;

export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector;

export const persistor = persistStore(store);
