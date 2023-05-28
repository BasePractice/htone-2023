
import {EBookingType, ECategoriesTypes, EFilterPlatformStatus} from './enums';

/**
 * Интерфейс (карточка) площадки
 *
 * @prop {ECategoriesTypes} category Категория;
 * @prop {string} name Наименование площадки;
 * @prop {string} description Описание;
 * @prop {string} locationAddress Адрес локации;
 * @prop {string} locationCoordinatesLat Координата на карте: широта;
 * @prop {string} locationCoordinatesLon Координата на карте: долгота;
 * @prop {string} locationAdditionalInfo Инструкции "как пройти" (доп. инфо);
 * @prop {string} schedule Расписание (Часы работы)
 * @prop {IContact[]} contacts Контакты;
 * @prop {string} url Ссылка на сайт владельца;
 * @prop {string} presentation Презентация;
 * @prop {string[]} photos Фотографии;
 * @prop {string} rentTerms Условия аренды;
 * @prop {EStatusRecords} status Статус активности площадки;
 * @prop {string} services
 * @prop {string} bookingType
 * @prop {string} freeRentableArea
 * @prop {string} totalArea
 * @prop {string} facilitiesEquipment
 * @prop {string} objectsCollectiveUse
 * @prop {string} [organization] Наименование организации;
 * @prop {string} [id] Идентификатор;
 */
export interface IPlatform {
    category: ECategoriesTypes,
    name: string,
    description: string,
    address: string,
    url: string,
    phone: string,
    email: string,
    working: string,
    active: boolean,
    attachments: [],
    attributes: [],
    latitude: string,
    longitude: string,
    services: [],
    unit_price: number | string,
    verified: boolean,
    company_name: string,


    /*locationAdditionalInfo: string,
    contacts: IContact[],
    presentation: string,
    photos: string[],
    rentTerms: string,
    status: EStatusRecords,
    booking_type?: string,
    freeRentableArea?: string,
    totalArea?: string,
    facilitiesEquipment?: string,
    objectsCollectiveUse?: string,
    organization?: string,*/

    company_id?: string,
    id?: string
}

export interface IAnyObject {
    [key: string]: any
}

export interface IFiltersPlatforms {
    category?: ECategoriesTypes | null,
    dateFrom?: string | null,
    dateTo?: string | null,
    bookingType?: EBookingType | null,
    platformStatus?: EFilterPlatformStatus | null
}
