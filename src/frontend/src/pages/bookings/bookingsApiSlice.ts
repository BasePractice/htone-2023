import {apiSlice} from '../../app/api/apiSlice';

import {EReferenceBooks} from '../../app/router/enums';
import {IBooking, IBookingBase, TItemBooking} from './types';


export const bookingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBookings: builder.query<IBookingBase[], Record<string, string>>({
            query: (arg) => {
                const {token, platform_id} = arg;
                return {
                    url: `/booking/${EReferenceBooks.PLATFORMS}/${platform_id}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),
        createBooking: builder.mutation<Record<string, string>, Record<string, string | Record<string, TItemBooking[]>>>({
            query: (arg) => {
                const {token, data} = arg;
                return {
                    url: '/booking',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: data
                };
            },
        }),
    })
});

export const {
    useLazyGetBookingsQuery,
    /*useVerifyCompanyMutation,
    useLazyGetCompanyQuery,*/
    useCreateBookingMutation,
    /*useDeactivateCompanyMutation*/
} = bookingsApiSlice;
