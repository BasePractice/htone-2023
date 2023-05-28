import {apiSlice} from '../../app/api/apiSlice';

/**
 * Слой RTKQ отправки запроса для блокировки записи.
 * Перенимаются переменные path: string, id: string, token: string
 */
export const alertConfirmApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        blockingRecord: builder.mutation<any, { path: string, id: string, token: string}>({
            query: data => {
                const {path, id, token} = data;
                return {
                    url: `/${path}/deactivate/${id}`,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            }
        }),
    })
});

export const {useBlockingRecordMutation} = alertConfirmApiSlice;
