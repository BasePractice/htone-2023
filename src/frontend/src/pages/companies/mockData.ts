import {ICompany} from './types';

export const mockData = [
    {
        id: '1',
        name: 'Наименование компании1',
        creator: '2',
        inn: '123456789',
        ogrn: '1234567890123',
        legal_address: 'юридический адрес 1',
        postal_address: 'почтовый адрес1',
        director: 'ФИО директора1',
        'verified': false,
        'activated': false,
        'employees': [
            'beb40e66-2415-4d7b-8a8e-1e4f9b8e90df'
        ],
        status: 'UNCONFIRMED'
    },
    {
        id: '2',
        name: 'Наименование компании2',
        creator: '3',
        inn: '123456789',
        ogrn: '1234567890123',
        legal_address: 'юридический адрес 2',
        postal_address: 'почтовый адрес2',
        director: 'ФИО директора2',
        'verified': true,
        'activated': true,
        'employees': [
            'beb40e66-2415-4d7b-8a8e-1e4f9b8e90df'
        ],
        status: 'ACTIVE'
    },
    {
        id: '3',
        name: 'Наименование компании3',
        creator: '1',
        inn: '123456789',
        ogrn: '1234567890123',
        legal_address: 'юридический адрес 3',
        postal_address: 'почтовый адрес3',
        'verified': true,
        'activated': false,
        director: 'ФИО директора3',
        'employees': [
            'beb40e66-2415-4d7b-8a8e-1e4f9b8e90df'
        ],
        status: 'BLOCKING'
    }
] as ICompany[];
