import Logout from '@mui/icons-material/Logout';
import Settings from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import {theme} from '../../app/themes/customTheme';
import {useLazyLogoutQuery} from '../../pages/auth/authApiSlice';
import {endAuthSession} from '../../pages/auth/authSlice';
import {IAnyObject} from '../../pages/platforms/types';
import {endUserSession} from '../../pages/users/userSlice';
import {getQuerySearch} from '../utils/apiUtils';
import {dropDownMenuStyle} from './helpers';

/**
 * Компонент выпадающего меню Профиля пользователя
 * @constructor
 */
function MenuProfile() {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const [logout] = useLazyLogoutQuery();
    const user = useAppSelector(state => state.user);
    const {access_token, refresh_token} = useAppSelector(state => state.authSession);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const editAccount = () => {
        window.location.href = 'https://cluster.sigm-a.ru:8443/realms/sigm-a/account/';
    };
    const logoutHandler = async () => {
        const data: IAnyObject = {
            client_id : process.env.REACT_APP_AUTH_CLIENT_ID,
            client_secret : process.env.REACT_APP_AUTH_CLIENT_SECRET,
            refresh_token : refresh_token,
            redirect_uri: `${process.env.REACT_APP_AUTH_REDIRECT_URL}${location.pathname}`
        };
        await logout({
            body: getQuerySearch(data, {
                questionMark: false
            }),
            token: access_token
        }).unwrap();
        dispatch(endUserSession());
        dispatch(endAuthSession());
        navigate('/');
    };

    return (
        <>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                {access_token ?
                    <Tooltip title="Профиль">
                        <IconButton
                            onClick={handleClick}
                            size="medium"
                            sx={{
                                p: '12px'
                            }}
                            aria-controls={open ?
                                'account-menu' :
                                undefined}
                            aria-haspopup="true"
                            aria-expanded={open ?
                                'true' :
                                undefined}
                        >
                            <Avatar sx={{
                                width: '60px',
                                height: '60px',
                                [theme.breakpoints.down(991)]: {
                                    width: '54px',
                                    height: '54px',
                                },
                                [theme.breakpoints.down(769)]: {
                                    width: '48px',
                                    height: '48px',
                                }
                            }}>{user.name.charAt(0)}</Avatar>
                        </IconButton>
                    </Tooltip> :

                    <Button component={Link} to={'/auth'} variant={'contained'} size='large'>
                        войти
                    </Button>
                }
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={dropDownMenuStyle}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom'
                }}
            >
                <MenuItem onClick={handleClose}>
                    <Avatar />  {user.name}
                </MenuItem>
                <Divider />

                <MenuItem onClick={editAccount}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    Редактировать
                </MenuItem>
                <MenuItem onClick={logoutHandler}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    Выход
                </MenuItem>
            </Menu>
        </>
    );
}

export default MenuProfile;
