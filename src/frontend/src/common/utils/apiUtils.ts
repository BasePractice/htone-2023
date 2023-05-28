/**
 * Функция преобразования объекта в строку запроса.
 *
 * @param {Object} params набор параметров для формирования строки запроса.
 * @param {boolean} questionMark флаг, отвечающий за знак вопроса
 * @param {boolean} clean отвечает за возможность передавать в запрос пустые параметры.
 */
export function getQuerySearch(params: any, {questionMark = true, clean = false} = {
}) {
    return (questionMark ?
        '?' :
        '') + Object.keys(params)
        .filter(key => !(clean && params[key] === undefined))
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
        .join('&');
}
