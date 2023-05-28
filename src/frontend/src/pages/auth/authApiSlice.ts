import {apiSlice} from '../../app/api/apiSlice';
import {getAuthorizationHash} from '../../common/utils/authUtils';
import {IAuthSession} from './types';

/**
 * Слой отправки запросов авторизации
 */
export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCode: builder.query<IAuthSession, string>({
            query: state => ({
                url: `${process.env.REACT_APP_AUTH_URL}${process.env.REACT_APP_AUTH_REQUEST_CODE_URL_PATH}?`+
                    'response_type=code&'+
                    `client_id=${process.env.REACT_APP_AUTH_CLIENT_ID}&`+
                    `scope=${process.env.REACT_APP_AUTH_SCOPE}&`+
                    `state=${state}&`+
                    `redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT_URL}${process.env.REACT_APP_AUTH_REDIRECT_URL_PATH}`,
                method: 'GET',
            }),
        }),
        getToken: builder.query<IAuthSession, any>({
            query: data => ({
                url: `${process.env.REACT_APP_AUTH_URL}${process.env.REACT_APP_AUTH_REQUEST_TOKEN_URL_PATH}`,
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${getAuthorizationHash()}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: data
            }),
        }),
        logout: builder.query<IAuthSession, Record<string, any>>({
            query: data => {
                const {token, body} = data;
                return {
                    url: `${process.env.REACT_APP_AUTH_URL}${process.env.REACT_APP_AUTH_REQUEST_LOGOUT_URL_PATH}`,
                    method: 'post',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body
                };
            },
        }),
    })
});

export const {useLazyGetTokenQuery, useLazyLogoutQuery, useLazyGetCodeQuery} = authApiSlice;
