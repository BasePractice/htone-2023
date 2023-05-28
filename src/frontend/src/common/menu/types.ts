import {ERoles} from '../../app/router/enums';

export type TRolesArray = ERoles[];

/**
 * Элемент меню
 *
 * @prop {string} name наименование кнопки.
 * @prop {TRolesArray} allowedRoles список ролей для которых показывается данный элемент меню.
 * @prop {string} [path] путь для роутера.
 * @prop {IMenuRoutes[]} [children] дочерние элементы выпадающего меню.
 */
export interface IMenuRoutes {

    name: string,
    allowedRoles: TRolesArray,
    path?: string,
    children?: IMenuRoutes[]
}

/**
 * Обертка для Link из 'react-router-dom'.
 *
 * @prop {string} text текст отображаемый на кнопке меню.
 * @prop {string} to путь передаваемый в компонент Link.
 */
export interface IListItemLinkProps {
    text: string,
    to: string
}
