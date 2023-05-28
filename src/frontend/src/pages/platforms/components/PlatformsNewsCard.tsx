import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Link} from 'react-router-dom';
import {colors, theme} from '../../../app/themes/customTheme';

/**
 * Компонент выводит новость.
 *
 * @prop
 */
function PlatformsNewsCard () {

    return (
        <Box
            sx={{
                pt: '150px'
            }}>
            <Box sx={{
                display: 'flex',
                gap: '40px',
                alignItems: 'center',
                flexWrap: 'wrap',
                mb: '40px',
                [theme.breakpoints.down(769)]: {
                    gap: '26px',
                    mb: '26px'
                },
                [theme.breakpoints.down(769)]: {
                    gap: '16px',
                    mb: '20px'
                }
            }}>
                <Typography variant="h3" sx={{
                    fontSize: '56px',
                    lineHeight: '70px',
                    color: colors.white
                }}
                >
                    Новости
                </Typography>
                <Button component={Link} to={'/news'} variant={'outlined'} size="large" sx={{
                    fontSize: '17px'
                }}>
                    все новости
                </Button>
            </Box>
            <Box sx={{
                display: 'block',
                p: '18px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '7px'
            }}>
                <Typography sx={{
                    fontSize: '17px',
                    lineHeight: '20px',
                    color: colors.white2,
                    fontWeight: '400',
                    [theme.breakpoints.down(1024)]: {
                        fontSize: '17px',
                        lineHeight: '18px',
                    },
                    [theme.breakpoints.down(769)]: {
                        fontSize: '16px',
                        lineHeight: '14px',
                    }
                }}>
                    21.04.2023
                </Typography>
                <Typography sx={{
                    fontSize: '24px',
                    lineHeight: '28px',
                    color: colors.white,
                    margin: '26px 0px',
                    [theme.breakpoints.down(1024)]: {
                        fontSize: '22px',
                        margin: '22px 0px',
                    },
                    [theme.breakpoints.down(769)]: {
                        fontSize: '20px',
                        margin: '16px 0px',
                    }
                }}>
                    Креативный центр услуг для бизнеса
                </Typography>
                <Typography sx={{
                    fontSize: '16px',
                    lineHeight: '20px',
                    color: colors.white3,
                    mb: '52px',
                    [theme.breakpoints.down(769)]: {
                        fontSize: '16px',
                        mb: '48px',
                    },
                    [theme.breakpoints.down(769)]: {
                        fontSize: '15px',
                        mb: '44px',
                    }
                }}>
                    На платформе появилась новая площадка для бронирования!
                </Typography>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'right'
                }}>
                    <Button size="large"
                        sx={{
                            fontSize: '17px',
                            outline: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        подробнее
                    </Button>
                </Box>
            </Box>

        </Box>

    );
}

export default PlatformsNewsCard;
