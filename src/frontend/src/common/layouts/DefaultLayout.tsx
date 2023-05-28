import Box from '@mui/material/Box';
import * as React from 'react';
import {useEffect, useMemo} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import {theme} from '../../app/themes/customTheme';
import {endAuthSession} from '../../pages/auth/authSlice';
import {endUserSession} from '../../pages/users/userSlice';
import Footer from '../components/footer/Footer';
import HeaderToolbar from '../toolbar/HeaderToolbar';
import {isValidAccessTokenCheck} from '../utils/authUtils';
import './style.css';


function DefaultLayout() {
    const {access_token} = useAppSelector(state => state.authSession);
    const location = useLocation();
    const dispatch = useAppDispatch();
    const path = location.pathname;


    useEffect(() => {
        if (!isValidAccessTokenCheck(access_token)) {
            dispatch(endUserSession());
            dispatch(endAuthSession());
        }
    }, []);

    const children = useMemo(() => <Outlet/>, [path]);
    return (
        <main>
            <HeaderToolbar />
            <div className={'wrapper'} >
                <div className={'container'}>
                    <Box sx={{
                        width: 'calc(100% - 120px)',
                        mx: 'auto',
                        minHeight: 'calc(100% - 100px)',
                        maxWidth: '1440px',
                        px: '60px',
                        [theme.breakpoints.down(991)]: {
                            px: '40px',
                            width: 'calc(100% - 80px)',
                        },
                        [theme.breakpoints.down(769)]: {
                            px: '20px',
                            width: 'calc(100% - 40px)',
                        }
                    }}
                    >
                        {children}

                    </Box>
                    <Footer />
                </div>
            </div>
        </main>
    );
}

export default DefaultLayout;
