import {zodResolver} from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {EMethod} from '../../../app/api/enums';
import {ERoles} from '../../../app/router/enums';
import {useAppDispatch, useAppSelector} from '../../../app/store/store';
import {theme} from '../../../app/themes/customTheme';
import TextBoxComponent from '../../../common/components/TextBoxComponent';
import TextFieldComponent from '../../../common/components/TextFieldComponent';
import {IUser} from '../../users/types';
import {useLazyGetUserByIdQuery} from '../../users/userApiSlice';
import {setUserCompany} from '../../users/userSlice';
import {useCreateUpdateCompanyMutation} from '../companiesApiSlice';
import {ICompany} from '../types';
import {companySchema, TCompanySchema} from '../validation';

const defaultFieldValue = {
    'name': '',
    'inn': '',
    'ogrn': '',
    'legal_address': '',
    'postal_address': '',
    'director': ''
} as ICompany;

/**
 * Component Props.
 *
 * @prop {boolean} [isEdit] Возможность редактирования компании.
 * @prop {ICompany} [data] Данные компании.
 * @prop {(flag: boolean) => void} [setOpenModal] Обработчик закрытия окна.
 */
interface IComponentProps {
    isEdit?: boolean,
    data?: ICompany | null,
    setOpenModal?: (flag: boolean) => void
}
function CompanyCardComponent ({isEdit, data, setOpenModal}: IComponentProps) {
    const [currentCompany, setCurrentCompany] = useState<ICompany>(data ?? defaultFieldValue);
    const [creatorCompany, setCreatorCompany] = useState<IUser | null | undefined>();
    const {access_token} = useAppSelector(state => state.authSession);
    const currentUser = useAppSelector(state => state.user);
    const dispatch = useAppDispatch();
    const [getUserById] = useLazyGetUserByIdQuery();
    const [createUpdateCompany] = useCreateUpdateCompanyMutation();
    const methods = useForm<TCompanySchema>({
        values: currentCompany,
        resolver: zodResolver(companySchema),
        mode: 'all'
    });

    const {
        handleSubmit,
        formState: {isValid}
    } = methods;

    const onSubmit = async (field: any) => {
        
        const response = access_token && await createUpdateCompany({
            data: field,
            id: currentCompany.id ?? '',
            token: access_token,
            method: currentCompany ?
                EMethod.UPDATE :
                EMethod.CREATE
        }).unwrap();
        if (!data) {
            const company = field as ICompany;
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            company.id = response?.id;
            setCurrentCompany(company);
            currentUser && setCreatorCompany(currentUser);
            dispatch(setUserCompany(company));
        }
        setOpenModal && setOpenModal(false);
    };

    const getUserName = () => {
        return (
            <>
                <Typography sx={{
                    fontSize: 16,
                    mb: 3
                }}>Ответственный</Typography>
                <TextBoxComponent
                    textKey="ФИО"
                    textValue={`${creatorCompany?.last_name ?? ''} ${creatorCompany?.first_name ?? ''} ${creatorCompany?.mid_name ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Телефон"
                    textValue={`${creatorCompany?.phone ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Эл. почта"
                    textValue={`${creatorCompany?.email ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Доп. инфо"
                    textValue={`${creatorCompany?.user_info ?? ''}`}
                />
            </>
        );
    };

    useEffect(() => {
        if (!data && currentUser?.companies?.length) {
            setCurrentCompany(currentUser.companies[0]);
            currentUser && setCreatorCompany(currentUser);
        }
    },[]);

    useEffect(() => {
        if (data && data.creator) {
            (async () => {
                const user = access_token && await getUserById({
                    id: data.creator,
                    token: access_token
                }).unwrap();
                user && setCreatorCompany(user);
            })();
        }
    },[data]);
    
    return (
        <>
            <Typography variant="h5" sx={{
                mb: 3,
                mt: 1,
                [theme.breakpoints.down(769)]: {
                    fontSize: '24px',
                    lineHeight: '1',
                },
            }}>
                Данные компании
            </Typography>
            <FormProvider {...methods}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                    sx={{
                        pt: 2
                    }}
                >
                    <Box mb={'50px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column'
                        }
                    }}>
                        <TextFieldComponent
                            name="name"
                            label="Наименование"
                            fullWidth
                            required
                            sx={{
                                width: '100%'
                            }}
                        />
                        <TextFieldComponent
                            name="inn"
                            label="ИНН"
                            fullWidth
                            required
                            sx={{
                                width: '100%'
                            }}
                        />
                        <TextFieldComponent
                            name="ogrn"
                            label="ОГРН"
                            fullWidth
                            required
                            sx={{
                                width: '100%'
                            }}
                        />
                    </Box>
                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column'
                        }
                    }}>
                        <TextFieldComponent
                            name="legal_address"
                            label="Юридический адрес"
                            sx={{
                                width: '100%'
                            }}
                            fullWidth
                            required
                        />
                        <TextFieldComponent
                            name="postal_address"
                            label="Почтовый адрес"
                            sx={{
                                width: '100%'
                            }}
                            fullWidth
                            required
                        />
                        <TextFieldComponent
                            name="director"
                            label="Директор"
                            sx={{
                                width: '100%'
                            }}
                            fullWidth
                            required
                        />
                    </Box>
                    {(currentUser.leading_role === ERoles.ROLE_ADMIN || currentUser.leading_role === ERoles.ROLE_LANDLORD) &&
                        creatorCompany &&
                        <>{getUserName()}</>}

                    {access_token && (isEdit || !data) &&
                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            disabled={!isValid}
                            sx={{
                                my: 2,
                                fontSize: 17
                            }}
                        >
                            сохранить
                        </Button>
                    }
                    {setOpenModal &&
                        <Button
                            size="large"
                            variant="contained"
                            color="secondary"
                            onClick={() => setOpenModal(false)}
                            sx={{
                                my: 2,
                                ml: 2,
                                fontSize: 17
                            }}
                        >
                            отмена
                        </Button>
                    }
                </Box>
            </FormProvider>

        </>
    );
}

export default CompanyCardComponent;
