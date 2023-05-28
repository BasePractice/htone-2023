import {zodResolver} from '@hookform/resolvers/zod/dist/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {FormProvider, useForm} from 'react-hook-form';
import TextFieldComponent from '../TextFieldComponent';
import {IContact} from './types';
import {contactsSchema, TContactsSchema} from './validation';

const defaultValuesContact: IContact = {
    name: '',
    desc: '',
    email: '',
    phone: ''
};

/**
 * Component Props.
 *
 * @prop {IPlatform} data Данные площадки.
 * @prop {(flag: boolean) => void} cancelFunc Обработчик закрытия окна.
 */
interface IComponentProps {
    data?: IContact,
    save: (contact: IContact) => void,
    cancelFunc: (flag: boolean) => void
}
function ContactFormComponent ({data, cancelFunc, save}: IComponentProps) {
    const methods = useForm<TContactsSchema>({
        defaultValues: data ?? defaultValuesContact,
        resolver: zodResolver(contactsSchema),
        mode: 'all'
    });

    const {
        handleSubmit,
        formState: {isValid}
    } = methods;

    const onSubmit = async (data: any) => {
        await save(data);
    };

    return (
        <>
            <Typography variant="h5" sx={{
                mb: 3,
                mt:1
            }}>
                Контакт
            </Typography>
            <FormProvider {...methods}>
                <Box component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        pt: 2
                    }}
                >
                    <TextFieldComponent
                        name="name"
                        label="Имя"
                        fullWidth
                        required
                        sx={{
                            mb: 2
                        }}
                    />
                    <TextFieldComponent
                        name="desc"
                        label="Доп. информация"
                        fullWidth
                        required
                        sx={{
                            mb: 2
                        }}
                    />
                    <TextFieldComponent
                        name="phone"
                        label="Телефон"
                        fullWidth
                        required
                        sx={{
                            mb: 2
                        }}
                    />
                    <TextFieldComponent
                        name="email"
                        label="Email"
                        fullWidth
                        required
                        sx={{
                            mb: 2
                        }}
                    />
                    <Button
                        type="submit"
                        size="medium"
                        variant="contained"
                        disabled={!isValid}
                        sx={{
                            my: 2,
                            fontSize: 17
                        }}
                    >
                        сохранить
                    </Button>
                    <Button
                        size="medium"
                        variant="contained"
                        color="secondary"
                        onClick={() => cancelFunc(false)}
                        sx={{
                            my: 2,
                            ml: 2,
                            fontSize: 17
                        }}
                    >
                        отмена
                    </Button>
                </Box>
            </FormProvider>
        </>
    );
}

export default ContactFormComponent;
