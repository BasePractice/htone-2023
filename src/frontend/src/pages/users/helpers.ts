import {ERoles} from '../../app/router/enums';
import {TRole} from './types';

export const getLeadingRole = (roles: TRole[]) => {
    const rolesArr = roles.map(role => role.name);
    if (rolesArr.includes(ERoles.ROLE_ADMIN))
        return ERoles.ROLE_ADMIN;
    if (rolesArr.includes(ERoles.ROLE_LANDLORD))
        return ERoles.ROLE_LANDLORD;
    return ERoles.ROLE_TENANT;
};
