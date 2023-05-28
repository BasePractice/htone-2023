import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {EAlertTypes} from './enums';
import {IAlert, IAlertError} from './types';

export const initialState: IAlert = {
    type: null,
    title: '',
    description: '',
    details: null
};

/**
 * Слой стора alert
 */
export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        setErrorAlert: (state, action: PayloadAction<IAlertError>) => {
            const {status, data} = action.payload;
            state.type = EAlertTypes.ALERT_ERROR;
            state.title = 'Произошла ошибка';
            if (status === 404 || status === 504) {
                state.description = 'Сервер не доступен';
            } else {
                if (data && data.code && data.description) {
                    state.description = data.code + ': ' + data.description;
                } else {
                    state.description = 'Неизвестная ошибка';
                }
            }
        },
        setNotificationAlert: (state, action: PayloadAction<IAlert>) => {
            const {title, description, details} = action.payload;
            state.type = EAlertTypes.ALERT_NOTIFICATION;
            state.title = title;
            state.description = description;
            state.details = details;
        },
        setConfirmationAlert: (state, data: PayloadAction<IAlert>) => {
            const {title, description, details} = data.payload;
            state.type = EAlertTypes.ALERT_CONFIRMATION;
            state.title = title;
            state.description = description;
            state.details = details;
        },
        setDefaultAlertType: (state) => {
            state.type = null;
            state.title = '';
            state.description = '';
            state.details = null;
        }
    },
});

export const {setErrorAlert, setNotificationAlert, setConfirmationAlert, setDefaultAlertType} = alertSlice.actions;
