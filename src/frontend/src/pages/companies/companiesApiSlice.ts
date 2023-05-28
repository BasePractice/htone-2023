import {apiSlice} from '../../app/api/apiSlice';
import {EMethod} from '../../app/api/enums';
import {EReferenceBooks} from '../../app/router/enums';
import {ICompany} from './types';


export const companiesApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCompanies: builder.query<ICompany[], Record<string, string>>({
            query: (arg) => {
                const {token, role} = arg;
                return {
                    url: `/${EReferenceBooks.COMPANIES}/role/${role}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),
        getCompany: builder.query<ICompany, Record<string, string>>({
            query: (arg) => {
                const {token, id} = arg;
                return {
                    url: `/${EReferenceBooks.COMPANIES}/${id}`,
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };
            },
        }),
        createUpdateCompany: builder.mutation<Record<string, string>, Record<string, string | boolean | EMethod | Record<string, string>>>({
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            query: (arg) => {
                const {token, data, method, id} = arg;
                const path = id ?
                    `/${id}` :
                    '';
                return {
                    url: `/${EReferenceBooks.COMPANIES}${path}`,
                    method,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json;charset=utf-8'
                    },
                    body: data
                };
            },
        }),
        verifyCompany: builder.mutation<any, Record<string, string>>({
            query: arg => {
                const {token, id} = arg;
                return {
                    url: `/${EReferenceBooks.COMPANIES}/verify/${id}`,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };},
        }),
        deactivateCompany: builder.mutation<any, Record<string, string>>({
            query: arg => {
                const {token, id} = arg;
                return {
                    url: `/${EReferenceBooks.COMPANIES}/deactivate/${id}`,
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                };},
        }),
    })
});

export const {
    useLazyGetCompaniesQuery, 
    useVerifyCompanyMutation, 
    useLazyGetCompanyQuery,
    useCreateUpdateCompanyMutation,
    useDeactivateCompanyMutation
} = companiesApiSlice;
