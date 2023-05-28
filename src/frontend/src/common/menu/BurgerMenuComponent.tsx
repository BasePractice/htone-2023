import CloseIcon from '@mui/icons-material/Close';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import {useMemo, useState} from 'react';
import {Link} from 'react-router-dom';
import {useAppSelector} from '../../app/store/store';
import {colors, theme} from '../../app/themes/customTheme';
import telegram from '../../assets/images/telegram.svg';
import vk from '../../assets/images/vk.svg';
import ModalBurgerMenuComponent from '../modal/ModalBurgerMenuComponent';
import {hasRole} from '../utils/authUtils';
import BurgerDropDownMenu from './BurgerDropDownMenu';
import MenuProfile from './MenuProfile';
import {menuRoutes} from './menuRoutes';

function BurgerMenuComponent() {
    const [openModal, setOpenModal] = useState(false);
    const {roles} = useAppSelector((state) => state.user);
    const userRoles = roles?.map(item => item.name) ?? [];
    //Получаем содержимое меню в зависимости от роли.
    const getMenuItems = () => {
        return menuRoutes
            .filter(({allowedRoles}) => hasRole(userRoles, allowedRoles))
            .map(({path, name, children}, i) => (
                path ?
                    <Button variant={'text'} key={i} sx={{
                        alignItems: 'center',
                        justifyContent: 'left',
                        fontSize: '20px',
                        color: '#FFFFFF',
                        lineHeight: '30px',
                    }} component={Link} to={path} onClick={() => setOpenModal(false)}
                    >
                        {name}
                    </Button> :
                    <BurgerDropDownMenu text={name} children={children} userRoles={userRoles} setOpenModal={setOpenModal} key={i}/>
            ));
    };

    const menuList = useMemo(() => getMenuItems(), [roles]);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            <MenuProfile/>
            <Tooltip title="Меню">
                <Button
                    onClick={() => setOpenModal(true)}
                    size="medium"
                    sx={{
                        ml: '20px',
                        p: '0px',
                        minWidth: 'fit-content',
                        height: '40px',
                        borderRadius: '0px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0)'
                        }
                    }}
                >
                    <Box
                        sx={{
                            width: '30px',
                            height: '12px',
                            borderRadius: '0px',
                            borderTop: '2px solid rgba(255, 255, 255, 0.8)',
                            borderBottom: '2px solid rgba(255, 255, 255, 0.8)'
                        }}>
                    </Box>
                </Button>
            </Tooltip>
            <ModalBurgerMenuComponent open={openModal} size="large">
                <Button
                    variant="contained"
                    onClick={() => setOpenModal(false)}
                    sx={{
                        minWidth: 'unset',
                        p: 1,
                        width: 30,
                        height: 30,
                        borderRadius: '0px',
                        position: 'absolute',
                        top: 60,
                        right: 40,
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        '&:hover': {
                            bgcolor: 'rgba(255, 255, 255, 0)'
                        },
                        [theme.breakpoints.down(769)]: {
                            top: 40,
                            right: 20,
                        }
                    }}
                >
                    <Tooltip title="Закрыть">
                        <CloseIcon sx={{
                            color: colors.white,
                            width: 40,
                            height: 40
                        }}/>
                    </Tooltip>
                </Button>
                <Box sx={{
                    display: 'block',
                    padding: '60px 25px',
                    fontSize: '20px',
                    textAlign: 'left',
                    [theme.breakpoints.down(769)]: {
                        padding: '40px 5px',
                    }
                }}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        mr: '60px',
                        ml: '15px'
                    }}>
                        {menuList}
                    </Box>
                    <Box sx={{
                        mx: '5px',
                        mt: '10px'
                    }}>
                        <Button component={Link} to={'https://t.me/akimoscow'} target='_blank' sx={{
                            display: 'felx',
                            justifyContent: 'center',
                            mx: '10px',
                            borderRadius: '100px',
                            width: '60px',
                            height: '60px',
                            maxWidth: '60px',
                            maxHeight: '60px',
                            minWidth: '60px',
                            minHeight: '60px',
                            padding: '0px 0px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0)'
                            },
                            '&:hover .MuiAvatar-img': {
                                opacity: '0.2',
                            }
                        }}>
                            <Avatar
                                sx={{
                                    width: '28px',
                                    height: '25px',
                                    borderRadius: '0px'
                                }}
                                src={telegram}
                                alt="Telegram"
                            />
                        </Button>
                        <Button component={Link} to={'https://vk.com/akimoscow'} target='_blank' sx={{
                            display: 'felx',
                            justifyContent: 'center',
                            mx: '10px',
                            borderRadius: '100px',
                            width: '60px',
                            height: '60px',
                            maxWidth: '60px',
                            maxHeight: '60px',
                            minWidth: '60px',
                            minHeight: '60px',
                            padding: '0px 0px',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            '&:hover': {
                                bgcolor: 'rgba(255, 255, 255, 0)'
                            },
                            '&:hover .MuiAvatar-img': {
                                opacity: '0.2',
                            }
                        }}>
                            <Avatar
                                sx={{
                                    width: '28px',
                                    height: '18px',
                                    borderRadius: '0px'
                                }}
                                src={vk}
                                alt="VK"
                            />
                        </Button>
                    </Box>
                </Box>
            </ModalBurgerMenuComponent>
        </Box>
    );
}

export default BurgerMenuComponent;
