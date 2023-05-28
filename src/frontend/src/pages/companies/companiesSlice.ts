import {createSlice} from '@reduxjs/toolkit';
import {companiesApiSlice} from './companiesApiSlice';
import {ICompany} from './types';

export const initialState: {companiesList: ICompany[]} = {
    companiesList: []
};

export const companiesSlice = createSlice({
    name: 'companies',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addMatcher(companiesApiSlice.endpoints.getCompanies.matchFulfilled, (state, action) => {
            state.companiesList = action.payload;
        });
    }
});
