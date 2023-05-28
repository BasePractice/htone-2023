import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {EReferenceBooks, ERoles} from '../../../app/router/enums';
import {useAppSelector} from '../../../app/store/store';
import {theme} from '../../../app/themes/customTheme';
import TextBoxComponent from '../../../common/components/TextBoxComponent';
import {useLazyGetCompanyQuery} from '../../companies/companiesApiSlice';
import {ICompany} from '../../companies/types';
import {IUser} from '../../users/types';
import {useLazyGetUserByIdQuery} from '../../users/userApiSlice';
import {IBooking} from '../types';


/**
 * Component Props.
 *
 * @prop {ICompany} [data] Данные брони.
 * @prop {(flag: boolean) => void} [setOpenModal] Обработчик закрытия окна.
 */
interface IComponentProps {
    data?: IBooking | null,
    setOpenModal: (flag: boolean) => void
}
function BookingCardComponent ({data, setOpenModal}: IComponentProps) {
    const [tenant, setTenant] = useState<IUser | null | undefined>();
    const [currentCompany, setCurrentCompany] = useState<ICompany | null>(null);
    const {access_token} = useAppSelector(state => state.authSession);
    const {leading_role} = useAppSelector(state => state.user);
    const [getUserById] = useLazyGetUserByIdQuery();
    const [getCompany] = useLazyGetCompanyQuery();
    const navigate = useNavigate();


    const getUserName = () => {
        return (
            <>
                <Typography sx={{
                    fontSize: 16,
                    mb: 3
                }}>Арендатор</Typography>
                <TextBoxComponent
                    textKey="ФИО"
                    textValue={`${tenant?.last_name ?? ''} ${tenant?.first_name ?? ''} ${tenant?.mid_name ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Телефон"
                    textValue={`${tenant?.phone ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Эл. почта"
                    textValue={`${tenant?.email ?? ''}`}
                />
                <TextBoxComponent
                    textKey="Доп. инфо"
                    textValue={`${tenant?.user_info ?? ''}`}
                />
            </>
        );
    };

    useEffect(() => {
        if (data && data.tenant_id) {
            (async () => {
                const user = access_token && await getUserById({
                    id: data.tenant_id,
                    token: access_token
                }).unwrap();

                user && setTenant(user);
                const company = access_token &&  await getCompany({
                    id: data.company_id || '',
                    token: access_token
                }).unwrap();
                company && setCurrentCompany(company);
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
                Данные бронирования
            </Typography>




            {data && <Box
                sx={{
                    pt: 2
                }}
            >
                <Grid container
                    columnSpacing={3}
                    rowSpacing={4}
                    columns={{
                        xs: 3,
                        md: 12,
                        sm: 3,
                    }}
                    sx={{
                        mb: 3,
                        [theme.breakpoints.down(769)]: {
                            direction: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                        }
                    }}
                >
                    {leading_role === ERoles.ROLE_ADMIN && <Grid item xs={6}>
                        <TextBoxComponent
                            textKey="Компания:"
                            textValue={currentCompany?.name}
                        />
                    </Grid>}
                    <Grid item xs={6}>
                        <TextBoxComponent
                            textKey="Наименование площадки:"
                            textValue={<Button sx={{
                                fontSize: '0.875rem',
                                fontWeight: 400,
                                textDecoration: 'underline'
                            }} variant="text" onClick={() => navigate(`/${EReferenceBooks.PLATFORMS}/${data.platform_id}`)}
                            >{data.platform_name}</Button>}
                        />
                    </Grid>
                </Grid>
                <Grid container
                    columnSpacing={3}
                    rowSpacing={4}
                    columns={{
                        xs: 3,
                        md: 12,
                        sm: 3,
                    }}
                    sx={{
                        mb: 3,
                        [theme.breakpoints.down(769)]: {
                            direction: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                        }
                    }}
                >
                    <Grid item xs={6}>
                        <TextBoxComponent
                            textKey="Адрес площадки:"
                            textValue={data.platform_address}
                        />
                    </Grid>
                </Grid>
                <Grid container
                    columnSpacing={3}
                    rowSpacing={4}
                    columns={{
                        xs: 3,
                        md: 12,
                        sm: 3,
                    }}
                    sx={{
                        mb: 3,
                        [theme.breakpoints.down(769)]: {
                            direction: 'column',
                            justifyContent: 'flex-start',
                            alignItems: 'stretch',
                        }
                    }}
                >

                    {leading_role !== ERoles.ROLE_TENANT && <Grid item xs={6}>
                        {getUserName()}
                    </Grid>}
                    <Grid item xs={6}>
                        <TextBoxComponent
                            textKey="Дата:"
                            textValue={data.date_use}
                        />
                    </Grid>
                    
                </Grid>
                {setOpenModal &&
                    <Button
                        size="large"
                        variant="contained"
                        color="secondary"
                        onClick={() => setOpenModal(false)}
                        sx={{
                            my: 2,
                            fontSize: 17
                        }}
                    >
                        закрыть
                    </Button>}
            </Box>}

        </>
    );
}

export default BookingCardComponent;
