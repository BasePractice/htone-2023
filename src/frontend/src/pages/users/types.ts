import {ERoles} from '../../app/router/enums';
import {ICompany} from '../companies/types';
import {EStatusRecords} from '../platforms/enums';

//todo добавить описание всех полей
export interface IUser {
    id: string | null,
    login?: string,
    name: string,
    last_name: string,
    first_name: string,
    mid_name: string,
    roles: TRole[] | null,
    leading_role?: ERoles | null,
    companies?: ICompany[],
    phone?: string,
    email?: string,
    activated?: boolean,
    user_info?: string,
    status?: EStatusRecords
}

export type TRole = {
    id?: string,
    name: ERoles,
    description?: string
};

