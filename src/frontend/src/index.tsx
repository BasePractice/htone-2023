import {ThemeProvider} from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {Provider} from 'react-redux';
import {RouterProvider} from 'react-router-dom';
import {PersistGate} from 'redux-persist/integration/react';
import {router} from './app/router';
import {store, persistor} from './app/store/store';
import {theme} from './app/themes/customTheme';
import './assets/styles/index.css';
import Alert from './common/alert/Alert';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <Provider store={store}>
        <ThemeProvider theme={theme}>
            <PersistGate persistor={persistor}>
                <RouterProvider router={router} />
                <Alert />
            </PersistGate>
        </ThemeProvider>
    </Provider>
);
