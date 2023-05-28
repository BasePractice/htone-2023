import {apiSlice} from '../../app/api/apiSlice';
import {IUser} from './types';

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUser, string>({
            query: (token) => ({
                url: '/me',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }),
        getUserById: builder.query<IUser, Record<string, string>>({
            query: ({token, id}) => ({
                url: `/users/${id}`,
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }),
        }),
        getUsersList: builder.query<IUser[], string>({
            query: (token) => ({
                url: 'users',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
        })
    })
});

export const {useLazyGetUserQuery, useLazyGetUserByIdQuery, useLazyGetUsersListQuery} = userApiSlice;
