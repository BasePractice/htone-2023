import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import moment from 'moment';
import {useEffect, useState} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';
import {Link, useParams} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from '../../app/store/store';
import {theme} from '../../app/themes/customTheme';
import {setNotificationAlert} from '../../common/alert/alertSlice';
import DatePickerComponent from '../../common/components/DatePickerComponent';
import TextBoxComponent from '../../common/components/TextBoxComponent';
import {useCreateBookingMutation} from '../bookings/bookingsApiSlice';
import {TItemBooking} from '../bookings/types';
import NotFound from '../notFound/NotFound';
import {setAlertState} from './helpers';
import {useLazyGetPlatformOpenQuery} from './platformsApiSlice';
import {IPlatform} from './types';

const style = {
    gridSX: {
        mb: 3,
        [theme.breakpoints.down(769)]: {
            direction: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
        }
    }
};

function PlatformDetail () {
    const params = useParams();
    const dispatch = useAppDispatch();
    const [getPlatformOpen] = useLazyGetPlatformOpenQuery();
    const [createBooking] = useCreateBookingMutation();
    const {access_token} = useAppSelector(state => state.authSession);
    const platformsList = useAppSelector(state => state.platformsList.platformsListOpen);
    const [platformNotFound, setPlatformNotFound] = useState(false);
    const [platform, setPlatform] = useState<IPlatform | undefined>(undefined);

    useEffect(() => {
        if (platformsList.length > 0)
            setPlatform(platformsList.find(item => item.id === params['id']));
        else {
            (async () => {
                const data = await getPlatformOpen(params['id'] ?? '').unwrap().catch(() => setPlatformNotFound(true));
                if (data) {
                    setPlatform(data);
                } else setPlatform(undefined);
            })();
        }
    }, [platformsList]);

    const methods = useForm({
        mode: 'all'
    });

    const {handleSubmit} = methods;

    const onSubmit = async (data: FieldValues) => {
        const dateFrom = moment(data.dateFrom, 'DD-MM-YYYY');
        const dateTo = moment(data.dateTo, 'DD-MM-YYYY');

        if (!dateFrom.isValid() || !dateTo.isValid() || dateFrom < moment() || dateTo < moment() || dateFrom > dateTo)
            dispatch(setNotificationAlert(setAlertState('Ошибка',
                'Неверно введены даты')));
        else {
            if (params['id']) {
                const period = Math.abs(moment().diff(dateTo, 'day') - moment().diff(dateFrom, 'day')) + 1;

                const itemsBooking: TItemBooking[] = [];
                let dayNumber = 0;
                while (dayNumber < period) {
                    const curDate = moment(dateFrom).add(dayNumber, 'days');
                    itemsBooking.push({
                        platform_id: params['id'],
                        date_use: curDate.format('YYYY-MM-DD')
                    });
                    dayNumber++;
                }
                const response = access_token && await createBooking({
                    data: {
                        items: itemsBooking
                    },
                    token: access_token,
                }).unwrap().catch(() => dispatch(setNotificationAlert(setAlertState('Ошибка',
                    'Даты заняты'))));
            }
        }
    };

    return (
        <>
            {
                platform && <>
                    <Typography variant="h5" sx={{
                        mb: 1,
                        mt: 4,
                        fontSize: 36,
                        [theme.breakpoints.down(769)]: {
                            fontSize: '24px'
                        }
                    }}>
                        {platform.name}
                    </Typography>
                    <Typography sx={{
                        mb: 3,
                        fontWeight: '700'
                    }}>
                        #{platform.category}
                    </Typography>
                    <Typography sx={{
                        mb: 3,
                        lineHeight: '24px',
                        maxWidth: '600px'
                    }}>
                        {platform.description}
                    </Typography>
                    <Typography sx={{
                        mb: 3,
                        textDecoration: 'underline',
                        '&:hover': {
                            textDecoration: 'none'
                        }
                    }}>
                        <Button variant={'text'}
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'left',
                                color: '#FFFFFF',
                                fontWeight: '400',
                                fontSize: '16px',
                                [theme.breakpoints.down(769)]: {
                                    fontSize: '15px'
                                }
                            }}
                            component={Link}
                            to={platform.url}
                        >
                            {platform.url}
                        </Button>
                    </Typography>
                    <Typography sx={{
                        mb: '4px',
                        color: '#757575'
                    }}>
                        Расписание:
                    </Typography>
                    <Typography sx={{
                        mb: 3,
                        lineHeight: '24px'
                    }}>
                        {platform.working}
                    </Typography>
                    <Typography sx={{
                        mb: '4px',
                        color: '#757575'
                    }}>
                        Адрес:
                    </Typography>
                    <Typography sx={{
                        mb: 3,
                        lineHeight: '24px'
                    }}>
                        {platform.address}
                    </Typography>
                    <Typography sx={{
                        mb: '4px',
                        fontWeight: '700'
                    }}>
                        Контакты:
                    </Typography>
                    <Typography sx={{
                        mb: '4px',
                        ml: '6px',
                        lineHeight: '24px',
                        color: '#757575'
                    }}>
                        Телефон:
                        <Button variant={'text'}
                            sx={{
                                alignItems: 'center',
                                justifyContent: 'left',
                                color: '#FFFFFF',
                                fontWeight: '400',
                                fontSize: '16px',
                                [theme.breakpoints.down(769)]: {
                                    fontSize: '15px'
                                }
                            }}
                            component={Link}
                            to={'mailto:' + platform.url}
                        >
                            {platform.url}
                        </Button>
                    </Typography>

            
                    <Box
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
                            sx={style.gridSX}
                        >
                            <Grid item xs={4}>
                                <TextBoxComponent
                                    textKey="Телефон:"
                                    textValue={platform.phone}
                                />
                            </Grid>
                            <Grid item xs={4}>
                                <TextBoxComponent
                                    textKey="Эл. почта:"
                                    textValue={platform.email}
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
                            sx={style.gridSX}
                        >
                            {access_token && <Grid item xs={4}>
                                <TextBoxComponent
                                    textKey="Цена (в сутки)(руб):"
                                    textValue={platform.unit_price}
                                />
                            </Grid>}
                        </Grid>
                    </Box>
                    {access_token && <>
                        
                        <Typography variant="h6" sx={{
                            mb: 3,
                            mt: 6,
                            fontSize: 24
                        }}>
                        Выбор дат бронирования
                        </Typography>
                        <FormProvider {...methods}>
                            <Box
                                component="form"
                                onSubmit={handleSubmit(onSubmit)}
                            >
                                <Grid container
                                    columnSpacing={3}
                                    rowSpacing={4}
                                    columns={{
                                        xs: 3,
                                        md: 12,
                                        sm: 3,
                                    }}
                                    sx={style.gridSX}
                                >
                                    <Grid item xs={3}
                                        width="100%"
                                        display="flex"
                                        justifyContent="space-between"
                                    >
                                        <DatePickerComponent
                                            name={'dateFrom'}
                                            defaultHelperText=""
                                            label="Дата от"
                                            format="DD-MM-YYYY"
                                            returnedFormat={'DD-MM-YYYY'}
                                            sx={{
                                                width: '100%',
                                            }}
                                        />

                                    </Grid>
                                    <Grid item xs={3}>
                                        <DatePickerComponent
                                            name={'dateTo'}
                                            defaultHelperText=""
                                            label="Дата до"
                                            format="DD-MM-YYYY"
                                            returnedFormat={'DD-MM-YYYY'}
                                            sx={{
                                                width: '100%',
                                            }}
                                        />
                                    </Grid>

                                </Grid>
                                <Button
                                    type="submit"
                                    size="large"
                                    variant="contained"
                                    sx={{
                                        fontSize: '17px',
                                        mb: 6
                                    }}
                                >
                                Забронировать
                                </Button>
                            </Box>
                        </FormProvider>
                    </>}
                </>
            }
            {
                platformNotFound && <NotFound />
            }
        </>
    );
}

export default PlatformDetail;
