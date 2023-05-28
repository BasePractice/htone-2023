import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

/**
 * Глобальный сервис API.
 */

/**
 * ApiSlice сервис
 */
export const apiSlice = createApi({
    reducerPath: 'apiSlice',
    baseQuery: fetchBaseQuery({
        baseUrl: '/api/v1'
    }),
    endpoints: () => ({
    }),
});
