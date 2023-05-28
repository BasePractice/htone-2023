import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useState} from 'react';
import {FieldValues, FormProvider, useForm} from 'react-hook-form';
import {colors, theme} from '../../../app/themes/customTheme';
import DatePickerComponent from '../../../common/components/DatePickerComponent';
import SelectComponent from '../../../common/components/SelectComponent';
import {ECategoriesTypes, EBookingType, EFilterPlatformStatus, EFilterPlatformStatusDesc, EViewType} from '../enums';
import {IFiltersPlatforms} from '../types';

export const defaultFilters: IFiltersPlatforms = {
    category: null,
    dateFrom: null,
    dateTo: null,
    bookingType: null,
    platformStatus: null
};

interface IComponentProps {
    filter: (data: IFiltersPlatforms, viewType: EViewType) => void, dataFilter: IFiltersPlatforms
}

function PlatformFilterComponent ({filter, dataFilter}: IComponentProps) {
    const [viewType, setViewType] = useState<EViewType>(EViewType.MAP);
    const methods = useForm({
        values: dataFilter,
        mode: 'all'
    });

    const {handleSubmit} = methods;

    const onSubmit = async (data: FieldValues) => {
        filter(data, viewType);
    };

    const setShowOnMap = () => {
        setViewType(EViewType.MAP);
    };

    const setShowList = () => {
        setViewType(EViewType.TABLE);
    };

    return (
        <>
            <Typography variant="h5" sx={{
                fontSize: '36px',
                lineHeight: '42px',
                fontWeight: '700',
                color: colors.white,
                mt: '8px',
                mb: '40px',
                [theme.breakpoints.down(769)]: {
                    fontSize: '24px',
                    lineHeight: '1'
                }
            }}>
                Поиск площадки
            </Typography>
            <FormProvider {...methods}>
                <Box
                    component="form"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column',
                            gap: '0px',
                        }
                    }}>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <Typography sx={{
                                mb: '8px',
                                color: colors.white,
                                fontSize: '18px'
                            }}>
                                Категория площадки
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '3',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto',
                                maxWidth: 'calc(100vw - 56px)'
                            }
                        }}>
                            <SelectComponent
                                controlled
                                name="category"
                                label=""
                                fullWidth
                                options={Object.values(ECategoriesTypes).map(value => ({
                                    label: value,
                                    value
                                }))}
                                sx={{
                                    [theme.breakpoints.down(769)]: {
                                        maxWidth: {
                                            xs: '100% !important',
                                            md: '28% !important'
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Box>
                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column',
                            gap: '0px',
                        }
                    }}>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto',
                                mb: '16px'
                            }
                        }}>
                            <Typography sx={{
                                mb: '8px',
                                color: colors.white,
                                fontSize: '18px'
                            }}>
                                Временной интервал
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '3',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <Box mb={'42px'} sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                justifyContent: 'space-between',
                                [theme.breakpoints.down(769)]: {
                                    flexDirection: 'column'
                                }
                            }}>
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
                            </Box>
                        </Box>
                    </Box>
                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column',
                            gap: '0px',
                        }
                    }}>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <Typography sx={{
                                mb: '8px',
                                color: colors.white,
                                fontSize: '18px'
                            }}>
                                Тип бронирования
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '3',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <SelectComponent
                                controlled
                                name="bookingType"
                                label=""
                                fullWidth
                                options={Object.values(EBookingType).map(value => ({
                                    label: value,
                                    value
                                }))}
                            />
                        </Box>
                    </Box>
                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        justifyContent: 'space-between',
                        [theme.breakpoints.down(769)]: {
                            flexDirection: 'column',
                            gap: '0px',
                        }
                    }}>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <Typography sx={{
                                mb: '8px',
                                color: colors.white,
                                fontSize: '18px'
                            }}>
                                Статус
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '3',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <SelectComponent
                                controlled
                                name="platformStatus"
                                label=""
                                fullWidth
                                options={Object.values(EFilterPlatformStatus).map(value => ({
                                    label: EFilterPlatformStatusDesc[value],
                                    value
                                }))}
                            />
                        </Box>
                    </Box>

                    <Box mb={'42px'} sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        flexWrap: 'wrap',
                        [theme.breakpoints.down(769)]: {
                            gap: '10px',
                        }
                    }}>
                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{
                                fontSize: '17px'
                            }}
                            onClick={setShowOnMap}
                        >
                            показать на карте
                        </Button>
                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{
                                fontSize: '17px'
                            }}
                            onClick={setShowList}
                        >
                            показать списком
                        </Button>
                    </Box>
                </Box>
            </FormProvider>
        </>
    );
}

export default PlatformFilterComponent;
