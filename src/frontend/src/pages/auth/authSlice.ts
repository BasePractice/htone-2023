import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {uuidv4} from '../../common/utils/authUtils';
import {authApiSlice} from './authApiSlice';
import {IAuthSession} from './types';

export const initialState: IAuthSession = {
    local_state: uuidv4(),
    from_page: '',
    access_token: null,
    expires_in: 0,
    id_token: null,
    refresh_expires_in: null,
    refresh_token: null,
    scope: null,
    session_state: null,
    token_type: null,
    'not-before-policy': null
};

export const authSlice = createSlice({
    name: 'authSession',
    initialState,
    reducers: {
        endAuthSession: (state) => {
            state.access_token = null;
            state.expires_in = 0;
            state.id_token = null;
            state.refresh_expires_in = null;
            state.refresh_token = null;
            state.scope = null;
            state.session_state = null;
            state.token_type = null;
        },
        setSessionFromPage: (state, action: PayloadAction<string>) => {
            state.from_page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApiSlice.endpoints.getToken.matchFulfilled, (state, action) => {
            const {
                access_token,
                expires_in,
                id_token,
                refresh_expires_in,
                refresh_token,
                scope,
                session_state,
                token_type
            } = action.payload;

            state.access_token = access_token;
            state.expires_in = new Date().getTime() + (expires_in ?
                expires_in :
                0);
            state.id_token = id_token;
            state.refresh_expires_in = refresh_expires_in;
            state.refresh_token = refresh_token;
            state.scope = scope;
            state.session_state = session_state;
            state.token_type = token_type;
        });
    }
});

export const {endAuthSession, setSessionFromPage} = authSlice.actions;
