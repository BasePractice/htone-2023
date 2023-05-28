import {isRejectedWithValue} from '@reduxjs/toolkit';
import type {MiddlewareAPI, Middleware} from '@reduxjs/toolkit';
//import {endAuthSession} from '../../pages/users/userSlice';
//import {router} from '../router';

export const rtkQueryErrorLoggerMiddleware: Middleware =
    (api: MiddlewareAPI) => (next) => (action) => {
        // RTK Query uses `createAsyncThunk` from redux-toolkit under the hood, so we're able to utilize these matchers!
        if (isRejectedWithValue(action)) {
            console.log(action, api);
            //проверить код ошибки
            /*if (action.payload.status === )
                router.navigate('/auth').then(() => {
                    api.dispatch(endAuthSession());
                    api.dispatch(endUserSession());
                });
            else
                api.dispatch(setErrorAlert(action.payload));*/
        }
        return next(action);
    };
