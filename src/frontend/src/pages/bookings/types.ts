import {EStatusRecords} from '../platforms/enums';

/**
 * Интерфейс карточки бронирования
 */
export interface IBooking extends IBookingBase{
    company_id?: string,
    company_name?: string,
    tenant_name?: string,
    platform_name: string,
    platform_address: string,
    contract_signed?: boolean,
    services?: [],
    status?: EStatusRecords
}

export type TItemBooking = {
    platform_id: string,
    date_use: string
};

export interface IBookingBase {
    date_use: string,
    id: string,
    platform_id: string,
    services?: [],
    tenant_id: string
}
