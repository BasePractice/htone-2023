import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@mui/material';
import {useEffect, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import {colors} from '../../app/themes/customTheme';
import {useBlockingRecordMutation} from './alertConfirmApiSlice';
import {setDefaultAlertType} from './alertSlice';
import {EActionsWithConfirmations, EAlertTypes} from './enums';

function Alert() {
    const dispatch = useAppDispatch();
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const {type, description, title, details} = useAppSelector(store => store.alert);
    const {access_token} = useAppSelector(state => state.authSession);
    const [blockingRecord] = useBlockingRecordMutation();
    useEffect(() => {
        if (type) {
            setIsOpen(true);
        }
    }, [type]);

    const handleClose = () => {
        dispatch(setDefaultAlertType());
        setIsOpen(false);
    };

    const handleAction = async () => {
        //выполнение действия подтверждения
        // todo использовать switch для выполнения определенных действий в зависимости от типа
        switch (details.action) {
        case EActionsWithConfirmations.BLOCKING_RECORD:
            await blockingRecord({
                path: details.path,
                id: details.id,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                token: access_token
            });
        }
        handleClose();
    };

    return (
        type &&
        <Dialog
            open={isOpen}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <Typography
                    component="p"
                >
                    {description}
                </Typography>
            </DialogContent>
            <DialogActions sx={{
                px: 3,
                pb: 2
            }}>
                {
                    type !== EAlertTypes.ALERT_CONFIRMATION ?
                        <Button onClick={handleClose} size='large' autoFocus sx={{
                            color: colors.white
                        }}
                        >
                            ОК
                        </Button> :
                        <>
                            <Button onClick={handleAction} variant="contained" size='large'>
                                да
                            </Button>
                            <Button onClick={handleClose} color="secondary" variant='contained' size='large' sx={{
                                color: colors.white
                            }}>
                                отмена
                            </Button>
                        </>
                }
            </DialogActions>
        </Dialog>
    );
}

export default Alert;
