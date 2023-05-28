import {createSlice} from '@reduxjs/toolkit';
import {platformsApiSlice} from './platformsApiSlice';
import {IPlatform} from './types';

export const initialState: {platformsList: IPlatform[], platformsListOpen: IPlatform[]} = {
    platformsList: [],
    platformsListOpen: []
};

export const platformsSlice = createSlice({
    name: 'platforms',
    initialState,
    reducers: {
        addPlatformToList: (state, action) => {
            state.platformsList.push(action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(platformsApiSlice.endpoints.getPlatforms.matchFulfilled, (state, action) => {
            state.platformsList = action.payload;
        });
        builder.addMatcher(platformsApiSlice.endpoints.getPlatformsOpen.matchFulfilled, (state, action) => {
            state.platformsListOpen = action.payload;
        });
    }
});

export const {addPlatformToList} = platformsSlice.actions;
