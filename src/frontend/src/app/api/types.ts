import {EStatusCode} from './enums';

/**
 * Generic Интерфейс ответа api сервера
 * todo Описать все поля и проверить на других запросах
 */
export interface IApiCommonResponse<T> {
    content: T,
    info: IApiCommonResponseInfo
}

/**
 * Интерфейс response info
 * todo Описать все поля и проверить на других запросах
 */
export interface IApiCommonResponseInfo {
    code: EStatusCode | null,
    description: string,
    details: any
}
