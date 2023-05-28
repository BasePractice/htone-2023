import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import * as React from 'react';
import {ReactNode} from 'react';
import {colors} from '../../app/themes/customTheme';
import {TSize} from './types';

const style = {
    width: '100%',
    height: 'fit-content',
    minHeight: '100vh',
    margin: 'auto auto',
    bgcolor: colors.grey,
    borderRadius: '0px',
    position: 'relative'
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
    return (
        <div>
            <Modal
                open={open}
                onClose={() => close !== undefined && close(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    display: 'flex',
                    position: 'fixed',
                    top: '0px',
                    right: '0px',
                    bottom: '0px',
                    left: '0px',
                }}
            >
                <Box sx={style} children={children} width={'100%'}/>
            </Modal>
        </div>
    );
}

export default ModalComponents;
