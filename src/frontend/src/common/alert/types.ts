import {IApiCommonResponseInfo} from '../../app/api/types';
import {EAlertTypes} from './enums';

/**
 * Интерфейс alertSlice модуля.
 *
 * @param {EAlertTypes | null} type тип alert`a
 * @param {string} title заголовок окна alert`a
 * @param {string} description описание alert`a
 * @param {any} [details] любые дополнительные сведения об alert`e,
 *  которые будут обрабатываться внутри компонента
 */
export interface IAlert {
    type: EAlertTypes | null,
    title: string,
    description: string,
    details?: any
}

/**
 * Интерфейс состояния errorAlert.
 *
 * @param {number | null} status status code ошибки
 * @param {IApiCommonResponseInfo | null} data содержание информации ответа
 */
export interface IAlertError {
    status: number,
    data: IApiCommonResponseInfo
}
