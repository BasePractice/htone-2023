import {Box} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom';
import {EReferenceBooks} from '../../../app/router/enums';
import {colors, theme} from '../../../app/themes/customTheme';
import {IPlatform} from '../types';

function PlatformShortCardComponent(props: { platform: IPlatform }) {
    const navigate = useNavigate();
    return <>
        <Box sx={{
            display: 'flex',
            margin: '0px',
            gap: '20px'
        }}>
            {/*<Box sx={{
                [theme.breakpoints.down(769)]: {
                    display: 'none'
                }
            }}>
                <Box
                    component="img"
                    src="http://more-radosti.ru/wp-content/uploads/2019/12/85-4.jpg"
                    alt={props.platform.name}
                    loading="lazy"
                    sx={{
                        width: '200px',
                        objectFit: 'cover'
                    }}
                ></Box>
            </Box>*/}
            <Box sx={{
                pr: '24px',
                width: '100%',
                [theme.breakpoints.down(769)]: {
                    width: 'calc(100% - 24px)',
                    pr: '32px',
                }
            }}>
                <Box sx={{
                    display: 'flex',
                    columnGap: '20px',
                    rowGap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    mb: '12px',
                    [theme.breakpoints.down(769)]: {
                        flexDirection: 'column',
                        alignItems: 'start',
                        mb: '16px'
                    }
                }}>
                    <Typography sx={{
                        color: colors.white,
                        fontSize: '24px',
                        fontWeight: '700',
                        lineHeight: '28px',
                        maxWidth: '100%',
                        [theme.breakpoints.down(1025)]: {
                            fontSize: '22px'
                        },
                        [theme.breakpoints.down(769)]: {
                            fontSize: '18px',
                            lineHeight: '24px'
                        }
                    }}>
                        {props.platform.name}
                    </Typography>
                    <Box sx={{
                        width: '144px',
                        height: '24px',
                        bgcolor: colors.red,
                        [theme.breakpoints.down(769)]: {
                            width: '116px',
                            height: '22px',
                        }
                    }}></Box>
                </Box>
                <Typography sx={{
                    color: colors.blue1,
                    fontSize: '17px',
                    mb: '12px',
                    fontWeight: '700',
                    [theme.breakpoints.down(769)]: {
                        fontSize: '15px'
                    }
                }}>
                    {props.platform.category}
                </Typography>
                <Typography sx={{
                    color: colors.blue1,
                    fontSize: '17px',
                    mb: '12px',
                    [theme.breakpoints.down(769)]: {
                        fontSize: '15px'
                    }
                }}>
                    {props.platform.address}
                </Typography>
                <Button
                    size="large"
                    variant="contained"
                    fullWidth
                    onClick={() => navigate(`/${EReferenceBooks.PLATFORMS}/${props.platform.id}`)}
                    sx={{
                        mt: '6px',
                        fontSize: '17px',
                        bgcolor: colors.blue2,
                        maxWidth: '700px',
                        '&:hover': {
                            bgcolor: colors.blue2_2
                        },
                        [theme.breakpoints.down(769)]: {
                            width: 'calc(100% + 32px)',
                        }
                    }}
                >
                    подробнее
                </Button>
            </Box>
        </Box>

    </>;
}

export default PlatformShortCardComponent;
