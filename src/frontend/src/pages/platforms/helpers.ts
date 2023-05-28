import {EActionsWithConfirmations} from '../../common/alert/enums';
import {IAlert} from '../../common/alert/types';

/**
 * Формирование данных для вывода в модальном окне уведомления
 *
 * @param {string} title Заголовок
 * @param {string} description Описание
 */
export const setAlertState = (title: string, description: string): IAlert => ({
    type: null,
    title,
    description,
    details: null,
});

/**
 * Формирование данных для вывода в модальном окне подтверждения блокировки записи справочника
 *
 * @param {string} path Идентификатор справочника (часть url), запись которого блокируется
 * @param {string} id Идентификатор записи в БД
 */
export const confirmationBlockingState = (path: string, id: string): IAlert => ({
    type: null,
    title: 'Блокировка записи',
    description: 'Вы уверены, что хотите заблокировать запись?',
    details: {
        id,
        path,
        action: EActionsWithConfirmations.BLOCKING_RECORD
    }
});
