import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ERoles} from '../../app/router/enums';
import {EStatusRecords} from '../platforms/enums';
import {IUser} from './types';
import {userApiSlice} from './userApiSlice';

export const initialState: IUser = {
    last_name: '',
    first_name: '',
    mid_name: '',
    roles: null,
    leading_role: null,
    email: '',
    phone: '',
    name: '',
    login: '',
    companies: [],
    status: EStatusRecords.UNCONFIRMED,
    id: null
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        endUserSession: (state) => {
            Object.assign(state, initialState);
        },
        setUserLeadingRole: (state, action: PayloadAction<ERoles>) => {
            state.leading_role = action.payload;
        },
        setUserCompany: (state, action) => {
            state.companies = [action.payload];
        },
        //не используется пока
        beginUserSession: (state, action: PayloadAction<IUser>) => {
            const data = action.payload;
            state.id = data.id;
            state.last_name = data.last_name;
            state.first_name = data.first_name;
            state.mid_name = data.mid_name;
            state.email = data.email;
            state.phone = data.phone;
            state.login = data.login;
            state.name = data.name;
            state.roles = data.roles;
            state.leading_role = data.leading_role;
            state.status = data.status;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(userApiSlice.endpoints.getUser.matchFulfilled, (state, action) => {
            const data = action.payload;
            state.id = data.id;
            state.last_name = data.last_name;
            state.first_name = data.first_name;
            state.mid_name = data.mid_name;
            state.email = data.email;
            state.phone = data.phone;
            state.login = data.login;
            state.name = data.name;
            state.roles = data.roles;
            state.companies = data.companies;
            state.status = data.status;
        });
    }
});

export const {endUserSession, setUserCompany, beginUserSession, setUserLeadingRole} = userSlice.actions;
