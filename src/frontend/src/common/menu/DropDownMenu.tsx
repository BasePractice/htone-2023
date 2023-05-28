import {ListItemButton} from '@mui/material';
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
function DropDownMenu(props: {text: string, children: IMenuRoutes[] | undefined, userRoles: ERoles[]}) {
    const {text, children, userRoles} = props;
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
            <ListItemButton onClick={handleClick} sx={{
                margin: '0px 15px'
            }}>
                <ListItemText primary={text}/>
            </ListItemButton>
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
                    horizontal: 'right',
                    vertical: 'bottom'
                }}
            >
                {children && children.filter(({allowedRoles}) => hasRole(userRoles, allowedRoles))
                    .map(({path, name, children}, i) => (
                        path ?
                            <MenuItem component={Link} to={path}  key={i}>
                                {name}
                            </MenuItem> :
                            <DropDownMenu text={name} children={children} userRoles={userRoles}  key={i}/>
                    ))
                }
            </Menu>
        </>

    );
}

export default DropDownMenu;
