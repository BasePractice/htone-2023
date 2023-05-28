import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {colors, theme} from '../../../app/themes/customTheme';

function WelcomeComponent() {
    return (
        <Box sx={{
            pt: '30px',
            [theme.breakpoints.down(769)]: {
                pt: '10px'
            }
        }}>
            <Typography variant="h2" sx={{
                fontSize: '84px',
                lineHeight: '105px',
                color: colors.white,
                mb: '80px',
                maxWidth: '1138px',
                [theme.breakpoints.down(1025)]: {
                    fontSize: '76px',
                    lineHeight: '95px',
                    mb: '62px',
                },
                [theme.breakpoints.down(991)]: {
                    fontSize: '68px',
                    lineHeight: '84px',
                    mb: '56px',
                },
                [theme.breakpoints.down(769)]: {
                    fontSize: '34px',
                    lineHeight: '1.4',
                    mb: '40px',
                }
            }}
            >
                Агрегатор площадок и услуг креативных индустрий Москвы
            </Typography>
            <Typography sx={{
                fontSize: '20px',
                lineHeight: '2',
                color: colors.white,
                mb: '20px',
                maxWidth: '634px',
                [theme.breakpoints.down(1025)]: {
                    fontSize: '18px',
                    lineHeight: '2'
                },
                [theme.breakpoints.down(769)]: {
                    fontSize: '14px',
                    lineHeight: '2',
                    maxWidth: '408px'
                }
            }}>
                Онлайн сервис бронирования креативных площадок и услуг.
            </Typography>
            <Typography sx={{
                fontSize: '20px',
                lineHeight: '2',
                color: colors.white,
                mb: '150px',
                maxWidth: '634px',
                [theme.breakpoints.down(1025)]: {
                    fontSize: '18px',
                    lineHeight: '2'
                },
                [theme.breakpoints.down(769)]: {
                    fontSize: '14px',
                    lineHeight: '2',
                    maxWidth: '408px'
                }
            }}>
                Это звукозаписывающие студии, галереи, киноплощадки для проведения съемок и кинотеатры для проведения показов и фестивалей и проч.  
            </Typography>
        </Box>
    );
}

export default WelcomeComponent;
