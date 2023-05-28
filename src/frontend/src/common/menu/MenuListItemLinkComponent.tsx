import {ListItemButton} from '@mui/material';
import ListItemText from '@mui/material/ListItemText';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {IListItemLinkProps} from './types';

function MenuListItemLinkComponent(props: IListItemLinkProps) {
    const {text, to} = props;
    return (
        <ListItemButton component={Link} to={to} sx={{
            margin: '0px 15px'
        }}>
            <ListItemText primary={text} sx={{
                lineHeight: '1.65',
            }}/>
        </ListItemButton>
    );
}

export default MenuListItemLinkComponent;
