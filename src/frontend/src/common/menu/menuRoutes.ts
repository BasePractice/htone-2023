import {EReferenceBooks, ERoles} from '../../app/router/enums';
import {TRolesArray, IMenuRoutes} from './types';

const allUsers: TRolesArray = [...Object.values(ERoles).map((item) => ERoles[item])];

/**
 * список роутев для меню
 */
export const menuRoutes: IMenuRoutes[] = [
    {
        path: '/about' ,
        name: 'О платформе',
        allowedRoles: []
    },
    {
        path: '/news',
        name: 'Новости',
        allowedRoles: []
    },
    {
        path: `/${EReferenceBooks.BOOKINGS}`,
        name: 'Брони',
        allowedRoles: [ERoles.ROLE_TENANT]
    },
    {
        name: 'Администрирование',
        allowedRoles: [ERoles.ROLE_ADMIN, ERoles.ROLE_LANDLORD],
        children: [
            {
                path: '/organization/me',
                name: 'Моя компания',
                allowedRoles: [ERoles.ROLE_LANDLORD]
            },
            {
                path: `/organization/${EReferenceBooks.PLATFORMS}`,
                name: 'Площадки',
                allowedRoles: [ERoles.ROLE_ADMIN, ERoles.ROLE_LANDLORD]
            },
            {
                path: `/${EReferenceBooks.BOOKINGS}`,
                name: 'Брони',
                allowedRoles: [ERoles.ROLE_ADMIN, ERoles.ROLE_LANDLORD],
            },
            {
                path: `/admin/${EReferenceBooks.USERS}`,
                name: 'Пользователи',
                allowedRoles: [ERoles.ROLE_ADMIN]
            },
            {
                path: `/admin/${EReferenceBooks.COMPANIES}`,
                name: 'Компании',
                allowedRoles: [ERoles.ROLE_ADMIN]
            },
        ]
    },


];
