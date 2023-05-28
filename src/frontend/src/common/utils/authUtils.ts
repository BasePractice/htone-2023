import {Buffer} from 'buffer';
import {ERoles} from '../../app/router/enums';

/**
 * Функция проверяет наличие ролей у авторизованного пользователя
 *
 * @param {ERoles[]} userRoles роли авторизованного пользователя
 * @param {ERoles[]} allowedRoles массив необходимых ролей
 */
export const hasRole = (userRoles: ERoles[], allowedRoles: ERoles[]):boolean => {
    if(!allowedRoles.length)
        return true;
    for (let i = 0; i < allowedRoles.length; i++) {
        if (userRoles.includes(allowedRoles[i])) {
            return true;
        }
    }
    return false;
};

/**
 * Переход на страницу ввода пароля в keycloak
 *
 * @param state локальный стейт для дальнейшей проверки, что пришёл запрос из того же браузера
 */
export const sendForAuthorization = (state: string) => {
    window.location.href = `${process.env.REACT_APP_AUTH_URL}${process.env.REACT_APP_AUTH_REQUEST_CODE_URL_PATH}?`+
        'response_type=code&'+
        `client_id=${process.env.REACT_APP_AUTH_CLIENT_ID}&`+
        `scope=${process.env.REACT_APP_AUTH_SCOPE}&`+
        `state=${state}&`+
        `redirect_uri=${process.env.REACT_APP_AUTH_REDIRECT_URL}${process.env.REACT_APP_AUTH_REDIRECT_URL_PATH}`;
};

/**
 * Получение Хеша для Basic Authorization
 */
export const getAuthorizationHash = () => {
    return Buffer.from(process.env.REACT_APP_AUTH_CLIENT_ID+':'+process.env.REACT_APP_AUTH_CLIENT_SECRET, 'binary')
        .toString('base64');
};

/**
 * Функция проверяет: истекло ли время валидности токена.
 *
 * @param {string} access_token токен доступа
 */
export const isValidAccessTokenCheck = (access_token: string | null) => {
    if (access_token) {
        const {exp} = parseJWT(access_token);
        const now: number = new Date().getTime();
        if (now < exp * 1000) {
            return true;
        }
    }
    return false;
};

/**
 * Получение данных из JWT токена доступа
 * @param jwt токен доступа
 */
export const parseJWT = (jwt: string): any => {
    return JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
};

/**
 * Получение uuid
 */
export const uuidv4 = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
        .replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0,
                v = c == 'x' ?
                    r :
                    (r & 0x3 | 0x8);
            return v.toString(16);
        });
};
