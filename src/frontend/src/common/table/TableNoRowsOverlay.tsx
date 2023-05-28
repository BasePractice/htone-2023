import {Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import {tableNoRowsOverlayDefaultText} from './constants';

/**
 * Кастомный лейбл при отсутствии данных в таблице
 * @param {string} labelText выводимый текст
 */

interface INoRowsOverlay {
    labelText?: string
}

function TableNoRowsOverlay({labelText = tableNoRowsOverlayDefaultText}: INoRowsOverlay) {
    return (
        <Stack height="100%" alignItems="center" justifyContent="center" minWidth="200px">
            <Typography>
                {labelText}
            </Typography>

        </Stack>
    );
}

export default TableNoRowsOverlay;
