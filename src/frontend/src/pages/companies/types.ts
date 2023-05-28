import {EStatusRecords} from '../platforms/enums';

/**
 * Интерфейс карточки бронирования
 */
export interface ICompany {
    id?: string,
    creator: string,
    name: string,
    user_name: string,
    inn: string,
    ogrn: string,
    legal_address: string,
    postal_address: string,
    director: string,
    verified: boolean,
    activated: boolean,
    employees: Array<string>,
    status: EStatusRecords
}
