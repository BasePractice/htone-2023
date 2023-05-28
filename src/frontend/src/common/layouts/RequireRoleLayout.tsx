import Typography from '@mui/material/Typography';
import {Outlet} from 'react-router-dom';
import {ERoles} from '../../app/router/enums';
import {useAppSelector} from '../../app/store/store';
import {hasRole} from '../utils/authUtils';

/**
 * Компонент (обертка) проверяет роли (права на route) пользователя и определяет,
 * может ли пользователь получить доступ к route.
 *
 * @param {ERoles[]} allowedRolesForThisRoute список доступных ролей для route.
 */
function RequireRoleLayout({allowedRolesForThisRoute}: {allowedRolesForThisRoute: ERoles[]}) {
    const {roles} = useAppSelector(state => state.user);
    const userRoles = roles?.map(item => item.name);
    return (
        userRoles && hasRole(userRoles, allowedRolesForThisRoute) ?
            <Outlet /> :
            <Typography variant={'h4'} fontSize={36} pt={5}>Ошибка - недостаточно прав</Typography>
    );
}

export default RequireRoleLayout;
