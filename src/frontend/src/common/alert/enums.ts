/**
 * Типы alert`ов.
 *
 * ALERT_SUCCESS успешный alert
 * ALERT_ERROR alert ошибки
 * ALERT_CONFIRMATION alert подтверждения
 */
export enum EAlertTypes {
    ALERT_NOTIFICATION = 'ALERT_NOTIFICATION',
    ALERT_ERROR = 'ALERT_ERROR',
    ALERT_CONFIRMATION = 'ALERT_CONFIRMATION'
}

/**
 * Типы действий после подтверждения пользователем в модальном окне
 *
 * BLOCKING_RECORD Блокировка записи
 */
export enum EActionsWithConfirmations {
    BLOCKING_RECORD = 'BLOCKING_RECORD'
}
