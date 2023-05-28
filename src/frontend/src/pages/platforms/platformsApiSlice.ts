import {apiSlice} from '../../app/api/apiSlice';
import {EMethod} from '../../app/api/enums';
import {IApiCommonResponse} from '../../app/api/types';
import {EReferenceBooks} from '../../app/router/enums';
import {IPlatform} from './types';

export const platformsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getPlatformsOpen: builder.query<IPlatform[], void>({
            query: () => ({
                url: `/open/${EReferenceBooks.PLATFORMS}`,
                method: 'GET',
            }),
        }),
        getPlatformOpen: builder.query<IPlatform, string>({
            query: (id) => ({
                url: `/open/${EReferenceBooks.PLATFORMS}/${id}`,
                method: 'GET',
            }),
        }),
        getPlatforms: builder.query<IPlatform[], Record<string, string>>({
            query: (arg) => {
                const {token, role} = arg;
                return {
                    url: `/${EReferenceBooks.PLATFORMS}/role/${role}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),

        createUpdatePlatform: builder.mutation<Record<string, string>, Record<string, string | boolean | EMethod | Record<string, string>>>({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            query: (arg) => {
                const {token, data, method, id} = arg;
                const path = id ?
                    `/${id}` :
                    '';
                return {
                    url: `/${EReferenceBooks.PLATFORMS}${path}`,
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: data
                };
            },
        }),

        activatePlatforms: builder.mutation<IPlatform[], Record<string, string>>({
            query: (arg) => {
                const {token, id} = arg;
                return {
                    url: `/${EReferenceBooks.PLATFORMS}/activate/${id}`,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),
        verifyPlatforms: builder.mutation<IPlatform[], Record<string, string>>({
            query: (arg) => {
                const {token, id} = arg;
                return {
                    url: `/${EReferenceBooks.PLATFORMS}/verify/${id}`,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),

        deletePlatform: builder.mutation<IApiCommonResponse<IPlatform[]>, string>({
            query: id => ({
                url: `/${EReferenceBooks.PLATFORMS}/${id}`,
                method: 'DELETE'
            }),
        })
    })
});

export const {
    useLazyGetPlatformsOpenQuery, useGetPlatformsQuery, useLazyGetPlatformsQuery, useCreateUpdatePlatformMutation,
    useVerifyPlatformsMutation, useActivatePlatformsMutation, useLazyGetPlatformOpenQuery
} = platformsApiSlice;
