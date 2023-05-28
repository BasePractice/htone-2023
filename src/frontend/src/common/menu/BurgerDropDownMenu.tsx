import {Button, ListItemButton} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {ERoles} from '../../app/router/enums';
import {hasRole} from '../utils/authUtils';
import {dropDownMenuStyle} from './helpers';
import {IMenuRoutes} from './types';

/**
 * Компонент вывода элементов выпадающего меню
 * @param props {text: string, children: IMenuRoutes[] | undefined, userRoles: ERoles[]}
 * @constructor
 */
function BurgerDropDownMenu(props: {text: string, children: IMenuRoutes[] | undefined, userRoles: ERoles[], setOpenModal?: (flag: boolean) => void}) {
    const {text, children, userRoles, setOpenModal} = props;
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Button onClick={handleClick} variant='text' sx={{
                alignItems: 'center',
                justifyContent: 'left',
                fontSize: '20px',
                color: '#FFFFFF',
                lineHeight: '30px',
            }}>
                {text}
            </Button>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                variant={'selectedMenu'}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={dropDownMenuStyle}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                anchorOrigin={{
                    horizontal: 'left',
                    vertical: 'bottom'
                }}
            >
                {children && children.filter(({allowedRoles}) => hasRole(userRoles, allowedRoles))
                    .map(({path, name, children}, i) => (
                        path ?
                            <Button onClick={() => setOpenModal && setOpenModal(false)} component={Link} to={path} variant={'text'} key={i} sx={{
                                width: 'calc(100% - 30px)',
                                alignItems: 'center',
                                justifyContent: 'left',
                                fontSize: '18px',
                                color: '#FFFFFF',
                                lineHeight: '30px',
                                my: '10px',
                                ml: '10px'
                            }}>
                                {name}
                            </Button> :
                            <BurgerDropDownMenu text={name} children={children} userRoles={userRoles} setOpenModal={setOpenModal} key={i}/>
                    ))
                }
            </Menu>
        </>

    );
}

export default BurgerDropDownMenu;
