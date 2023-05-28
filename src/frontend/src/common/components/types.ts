// Файл содержит переиспользуемые типы базовый компонентов
import {TextFieldProps} from '@mui/material';

export type TOption = {
    value: string,
    label: string
};

/**
 * Базовый компонент TextField
 *
 * @param {string} name название поля используется в Controller
 * @param {string} [defaultHelperText] вспомогательный текст
 */
export type TTextFieldProps = {
    name: string,
    defaultHelperText?: string
} & TextFieldProps;

export type TUniversalOption = {
    [key: string]: any
};
