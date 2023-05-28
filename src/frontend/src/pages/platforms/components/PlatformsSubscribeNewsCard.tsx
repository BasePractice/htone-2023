import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useForm, FormProvider} from 'react-hook-form';
import {colors, theme} from '../../../app/themes/customTheme';
import SelectComponent from '../../../common/components/SelectComponent';
import TextFieldComponent from '../../../common/components/TextFieldComponent';

/**
 * Компонент подписки на новости.
 *
 * @prop
 */
function PlatformsSubscribeNewsCard () {
    const methods = useForm({
        mode: 'all'
    });
    return (
        <FormProvider {...methods}>
            <Box
                component="form"
                sx={{
                    pt: '50px',
                    mb: '160px'
                }}>
                <Typography variant="h3" sx={{
                    fontSize: '56px',
                    lineHeight: '70px',
                    color: colors.white,
                    mb: '40px'
                }}
                >
                Подписка на новости
                </Typography>
                <Box sx={{
                    display: 'block',
                    p: '18px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '7px'
                }}>
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
                                fontSize: '17px',
                                lineHeight: '24px',
                                color: colors.white,
                                mb: 2,
                                [theme.breakpoints.down(1024)]: {
                                    fontSize: '16px',
                                    lineHeight: '21px',
                                },
                                [theme.breakpoints.down(769)]: {
                                    fontSize: '15px',
                                    lineHeight: '18px',
                                }
                            }}>
                            Выберете тип интересуемой площадки
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <SelectComponent
                                controlled
                                name="platforms"
                                label="Площадка"
                                fullWidth
                            
                                options={[{
                                    label: 'Все',
                                    value: 'Все'
                                }]}

                                sx={{
                                    fontSize: '17px',
                                    [theme.breakpoints.down(1024)]: {
                                        fontSize: '16px'
                                    },
                                    [theme.breakpoints.down(769)]: {
                                        fontSize: '15px'
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
                            }
                        }}>
                            <Typography sx={{
                                fontSize: '17px',
                                lineHeight: '24px',
                                color: colors.white,
                                mb: 2,
                                [theme.breakpoints.down(1024)]: {
                                    fontSize: '16px',
                                    lineHeight: '21px',
                                },
                                [theme.breakpoints.down(769)]: {
                                    fontSize: '15px',
                                    lineHeight: '18px'
                                }
                            }}>
                            Введите ваш Email, чтобы не пропустить открытие новых площадок!
                            </Typography>
                        </Box>
                        <Box sx={{
                            flex: '1',
                            width: '100%',
                            [theme.breakpoints.down(769)]: {
                                flex: 'auto'
                            }
                        }}>
                            <TextFieldComponent
                                name="email"
                                label="Email"
                                fullWidth
                            />
                        </Box>
                    </Box>
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <Button
                            type="submit"
                            size="large"
                            variant="contained"
                            sx={{
                                fontSize: '16px',
                                width: '446px',
                                bgcolor: colors.red
                            }}
                        >
                        подписаться на новости
                        </Button>
                    </Box>
                
                </Box>
            </Box>
        </FormProvider>
    );
}

export default PlatformsSubscribeNewsCard;
