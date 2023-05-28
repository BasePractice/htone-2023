import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as React from 'react';
import {useMemo} from 'react';
import {Link} from 'react-router-dom';
import {useAppSelector} from '../../app/store/store';
import telegram from '../../assets/images/telegram.svg';
import vk from '../../assets/images/vk.svg';
import {hasRole} from '../utils/authUtils';
import DropDownMenu from './DropDownMenu';
import MenuListItemLinkComponent from './MenuListItemLinkComponent';
import MenuProfile from './MenuProfile';
import {menuRoutes} from './menuRoutes';

/**
 * Компонент формирования меню для перехода на страницы в зависимости от ролей пользователя
 * @constructor
 */
function MenuComponent() {
    const {roles} = useAppSelector((state) => state.user);
    console.log(roles);
    const userRoles = roles?.map(item => item.name) ?? [];
    //Получаем содержимое меню в зависимости от роли.
    const getMenuItems = () => {
        return menuRoutes
            .filter(({allowedRoles}) => hasRole(userRoles, allowedRoles))
            .map(({path, name, children}, i) => (
                path ?
                    <MenuListItemLinkComponent
                        key={i}
                        to={path}
                        text={name}/> :
                    <DropDownMenu text={name} children={children} userRoles={userRoles} key={i}/>
            ));
    };

    const menuList = useMemo(() => getMenuItems(), [roles]);

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            textAlign: 'center'
        }}>
            {menuList}
            <Box sx={{
                mr: '15px',
                ml: '-10px'
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
            <MenuProfile/>
        </Box>
    );
}

export default MenuComponent;
