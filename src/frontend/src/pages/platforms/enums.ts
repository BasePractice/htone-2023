/**
 * Виды креативных площадок.
 */
export enum ECategoriesTypes {
    ART = 'Арт',
    ARCHITECTURE = 'Архитектура',
    GAMES_SOFTWARE = 'Видеоигры и ПО',
    DESIGN = 'Дизайн',
    FILMS_CREATING = 'Издательское дело и новые медиа',
    PERFORMING_ARTS = 'Исполнительские искусства',
    FILM_ANIMATION = 'Кино и анимация',
    FASHION = 'Мода',
    MUSIC = 'Музыка',
    ADVERTISEMENT = 'Реклама'
}

/**
 * Статус записи
 *
 * ACTIVE Активна
 * BLOCKING Заблокирована
 * UNCONFIRMED Не подтверждена
 * CLOSED Закрыта
 */
export enum EStatusRecords {
    ACTIVE = 'ACTIVE',
    BLOCKING = 'BLOCKING',
    UNCONFIRMED = 'UNCONFIRMED',
    CLOSED = 'CLOSED'
}

/**
 * Статус записи
 *
 * ACTIVE Активна
 * BLOCKING Заблокирована
 * UNCONFIRMED Не подтверждена
 * CLOSED Закрыта
 */
export enum EStatusRecordsDesc {
    ACTIVE = 'Активна',
    BLOCKING = 'Заблокирована',
    UNCONFIRMED = 'Не подтверждена',
    CLOSED = 'Закрыта'
}


/**
 * Тип бронирования
 *
 * SHORT_TERM Краткосрочное
 * LONG_TERM Долгосрочное
 * ANY Любое
 */
export enum EBookingType {
    ANY = 'Любое',
    SHORT_TERM = 'Краткосрочное',
    LONG_TERM = 'Долгосрочное',
}

/**
 * Статус площадки
 *
 * ANY Любой
 * FREE Свободна
 * BUSY Занята
 */
export enum EFilterPlatformStatus {
    ANY = 'ANY',
    FREE = 'FREE',
    BUSY = 'BUSY'
}

/**
 * Статус площадки, описание
 *
 * ANY Любой
 * FREE Свободна
 * BUSY Занята
 */
export enum EFilterPlatformStatusDesc {
    ANY = 'Любой',
    FREE = 'Свободна',
    BUSY = 'Занята'
}

/**
 * Тип просмотра
 *
 * MAP На карте
 * TABLE Списком в таблице
 */
export enum EViewType {
    MAP = 'MAP',
    TABLE = 'TABLE'
}
