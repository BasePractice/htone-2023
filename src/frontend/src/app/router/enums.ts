/**
 * Список ролей в проекте.
 * todo заполнить список
 *   написать документацию с описанием роли
 */
export enum ERoles {
    ROLE_LANDLORD = 'ROLE_LANDLORD',
    ROLE_TENANT = 'ROLE_TENANT',
    ROLE_ADMIN = 'ROLE_ADMIN',
}

export enum ERolesDesc {
    ROLE_LANDLORD = 'Арендодатель',
    ROLE_TENANT = 'Арендатор',
    ROLE_ADMIN = 'Администратор',
}

/**
 * Перечисления типов справочников - адреса страниц и часть адресов АПИ
 */
export enum EReferenceBooks {
    PLATFORMS = 'platforms',
    BOOKINGS = 'bookings',
    USERS = 'users',
    COMPANIES = 'companies'
}
