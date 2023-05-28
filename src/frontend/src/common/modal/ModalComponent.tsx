import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import Tooltip from '@mui/material/Tooltip';
import * as React from 'react';
import {ReactNode, useEffect} from 'react';
import {colors, theme} from '../../app/themes/customTheme';
import {TSize} from './types';

const style = {
    height: 'fit-content',
    margin: 'auto auto',
    bgcolor: colors.grey,
    p: '32px',
    borderRadius: '7px',
    position: 'relative',
    border: '1px solid #2C495E',
    [theme.breakpoints.down(769)]: {
        my: '-20px',
        minHeight: 'calc(100vh - 80px)',
        padding: '40px 20px',
        border: 'none',
        borderRadius: '0px'
    }
};

/**
 * Component Props.
 *
 * @prop {boolean} open Флаг открытия модального окна.
 * @prop {ReactNode} children Контент.
 * @prop {TSize} [size] Тип размера окна.
 * @prop {(flag: boolean) => void} [close] Обработчик закрытия окна.
 */
interface IComponentProps {
    open: boolean,
    children: ReactNode,
    size?: TSize,
    close?: (flag: boolean) => void
}

function ModalComponents({open, children, size='medium', close}: IComponentProps) {
    const [width, setWidth] = React.useState(0);

    useEffect(() => {
        switch (size) {
        case 'large':
            setWidth(1000);
            break;
        case 'small':
            setWidth(300);
            break;
        default:
            setWidth(600);
        }
    }, []);

    return (
        <div>
            <Modal
                open={open}
                onClose={() => close !== undefined && close(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    maxHeight: '100vh',
                    padding: '20px 0px',
                    overflowY: 'auto',
                    display: 'flex',
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px'
                }}
            >
                <Box sx={style} width={width}>
                    {close &&
                        <Button
                            variant="contained"
                            onClick={() => close !== undefined && close(false)}
                            sx={{
                                minWidth: 'unset',
                                p: 1,
                                width: 30,
                                height: 30,
                                borderRadius: 30,
                                position: 'absolute',
                                top: 40,
                                right: 33,
                                bgcolor: colors.blue2,
                                '&:hover': {
                                    bgcolor: colors.blue2_2
                                },
                                [theme.breakpoints.down(769)]: {
                                    top: 40,
                                    right: 20,
                                    width: '40px',
                                    height: '40px',
                                    bgcolor: 'unset',
                                    '&:hover': {
                                        bgcolor: 'unset'
                                    },
                                }
                            }}
                        >
                            <Tooltip title="Закрыть">
                                <CloseIcon sx={{
                                    color: colors.white3,
                                    width: 20,
                                    height: 20,
                                    [theme.breakpoints.down(769)]: {
                                        width: '40px',
                                        height: '40px',
                                    }
                                }}/>
                            </Tooltip>
                        </Button>
                    }
                    {children}
                </Box>
            </Modal>
        </div>
    );
}

export default ModalComponents;
