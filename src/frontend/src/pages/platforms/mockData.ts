import {IPlatform} from './types';

export const mockData = [{
    'id': 22,
    'category': 'Выставочный зал',
    'name': 'Название моей площадки',
    'company_name': 'Название организации 1',
    'company_id': 2,
    'description': '',
    'address': 'адрес',
    'latitude': '55.44',
    'longitude': '37.44',
    'locationAdditionalInfo': 'от метро 3 шага прямо, потом 4 налево',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 24,
    'category': 'Рендеринг студия',
    'name': 'Название моей площадки2',
    'organization': 'Название организации 2',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.384',
    'longitude': '37.384',
    'locationAdditionalInfo': 'от метро 3 шага прямо, потом 4 налево',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 23,
    'category': 'Выставочный зал',
    'name': 'Название моей площадки3',
    'organization': 'Название организации 3',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.34',
    'longitude': '37.34',
    'locationAdditionalInfo': 'от метро 3 шага прямо, потом 4 налево',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'BLOCKING'
},
{
    'id': 21,
    'category': 'Рендеринг студия',
    'name': 'Название моей площадки4',
    'organization': 'Название организации 4',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.31',
    'longitude': '37.31',
    'locationAdditionalInfo': 'от метро 3 шага прямо, потом 4 налево',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 28,
    'category': 'Художественная мастерская',
    'name': 'Название моей площадки22',
    'organization': 'Название организации 5',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.39',
    'longitude': '37.39',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 222,
    'category': 'Художественная мастерская',
    'name': 'Название моей площадки22',
    'organization': 'Название организации 6',
    'description': '',
    'locationAddress': 'г.Москва, 2 Фрезерная, 6 ',
    'latitude': '55.74',
    'longitude': '37.74',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},

{
    'id': 55,
    'category': 'Фото-видеостудия',
    'name': 'Фото-видеостудия',
    'organization': 'Название организации 7',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.14',
    'longitude': '37.14',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 44,
    'category': 'Пошивочный цех',
    'name': 'Шьём сами',
    'organization': 'Название организации 8',
    'description': '',
    'locationAddress': 'г. Москва, Хорошевская эстакада, 28сб',
    'latitude': '55.77',
    'longitude': '37.54',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 43,
    'category': 'Концертная площадка',
    'name': 'Название моей площадки22',
    'organization': 'Название организации 9',
    'description': '',
    'locationAddress': 'адрес',
    'latitude': '55.66',
    'longitude': '37.64',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 48,
    'category': 'Рендеринг студия',
    'name': 'Название моей площадки22',
    'organization': 'Название организации 10',
    'description': '',
    'address': 'адрес',
    'latitude': '55.34',
    'longitude': '37.34',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
},
{
    'id': 38,
    'category': 'Рендеринг студия',
    'name': 'Название моей площадки22',
    'organization': 'Название организации 11',
    'description': '',
    'address': 'адрес',
    'latitude': '55.54',
    'longitude': '37.34',
    'working': '',
    'contacts': [
        {
            'name': 'ttt',
            'desc': 'yyyy',
            'email': 'ff@gg.jj',
            'phone': '656565'
        },
        {
            'name': 'rrrr',
            'desc': 'kkk',
            'email': 'yy@gg.jj',
            'phone': '85656'
        }
    ],
    'url': 'yandex.ru',
    'presentation': 'ссылка на файл',
    'photos': ['ссылка на фото 1', 'ссылка на фото 2', 'ссылка на фото 3'],
    'rentTerms': 'условия',
    'status': 'ACTIVE'
}
] as unknown as IPlatform[];
