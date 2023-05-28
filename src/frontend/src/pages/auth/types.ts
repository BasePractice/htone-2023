/**
 * Интерфейс сессии.
 *
 * @param {string} local_state локальный идентификатор сессии
 */
export interface IAuthSession {
    local_state: string,
    from_page: string,
    access_token: string | null,
    expires_in: number,
    id_token: string | null,
    'not-before-policy': number | null,
    refresh_expires_in: number | null,
    refresh_token: string | null,
    scope: string | null,
    session_state: string | null,
    token_type: string | null
}
