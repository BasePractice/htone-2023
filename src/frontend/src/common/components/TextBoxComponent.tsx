import {Box, Typography} from '@mui/material';
import React, {ReactNode} from 'react';
import {colors} from '../../app/themes/customTheme';

/**
 * Компонент отображения текста в формате key: value
 *
 * @param {string} textKey ключ поля
 * @param {ReactNode | string | undefined | null} textValue значение поля
 */
function TextBoxComponent({textKey, textValue}: {textKey: string, textValue: ReactNode | string | undefined | null}) {
    return (
        <Box
            sx={{
                display: 'flex',
                mb: 1
            }}
        >
            <Typography
                sx={{
                    color: colors.grey4,
                    mr: 1
                }}>
                {textKey}
            </Typography>
            {
                !textValue || typeof textValue === 'string' || typeof textValue === 'number' ?
                    <Typography>{textValue}</Typography> :
                    <>{textValue}</>
            }

        </Box>
    );
}

export default TextBoxComponent;
