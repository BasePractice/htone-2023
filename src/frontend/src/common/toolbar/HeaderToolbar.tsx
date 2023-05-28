import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import Toolbar from '@mui/material/Toolbar';
import * as React from 'react';
import {useNavigate} from 'react-router-dom';
import {colors, theme} from '../../app/themes/customTheme';
import logo from '../../assets/images/logo.png';
import BurgerMenuComponent from '../menu/BurgerMenuComponent';
import MenuComponent from '../menu/MenuComponent';

/**
 * Компонент шапки сайта
 * @constructor
 */
function HeaderToolbar() {
    const navigate = useNavigate();
    return (
        <AppBar position="fixed" sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            bgcolor: colors.black4,
            insetInline: 'auto',
            width: '100%',
            paddingRight: '0px !important'
        }}>
            <Toolbar sx={{
                width: 'calc(100% - 120px)',
                maxWidth: '1440px',
                mx: 'auto',
                px: '60px',
                height: '100px',
                [theme.breakpoints.down(991)]: {
                    px: '40px',
                    width: 'calc(100% - 80px)',
                },
                [theme.breakpoints.down(769)]: {
                    px: '20px',
                    width: 'calc(100% - 40px)',
                    height: '80px'
                }
            }}
            >
                <Avatar
                    sx={{
                        width: '127px',
                        height: 'auto',
                        [theme.breakpoints.down(769)]: {
                            width: '90px'
                        }
                    }}
                    src={logo}
                    alt="Логотип"
                    variant="square"
                    onClick={() => navigate('/')}
                />
                
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{
                        [theme.breakpoints.down(991)]: {
                            display: 'none'
                        }
                    }}
                >
                    <MenuComponent />
                </Grid>
                <Grid
                    container
                    direction="row"
                    justifyContent="flex-end"
                    alignItems="center"
                    sx={{
                        [theme.breakpoints.up(991)]: {
                            display: 'none'
                        }
                    }}
                >
                    <BurgerMenuComponent />
                </Grid>
            </Toolbar>
        </AppBar>
    );
}

export default HeaderToolbar;
