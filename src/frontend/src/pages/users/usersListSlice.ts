import {createSlice} from '@reduxjs/toolkit';
import {IUser} from './types';
import {userApiSlice} from './userApiSlice';

export const initialState = {
    list: [] as IUser[]
};

export const usersListSlice = createSlice({
    name: 'usersList',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addMatcher(userApiSlice.endpoints.getUsersList.matchFulfilled, (state, action) => {
            state.list = action.payload;
        });
    }
});
