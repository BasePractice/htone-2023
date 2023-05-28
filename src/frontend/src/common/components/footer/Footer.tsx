import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import * as React from 'react';
import {Link} from 'react-router-dom';
import {theme} from '../../../app/themes/customTheme';

function Footer () {
    
    return (

        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            py: '32px',
        }}>
            <Box
                width={'100%'}
                sx={{
                    mx: '60px',
                    width: 'calc(100% - 120px)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    maxWidth: '1440px',
                    gap: '6px',
                    [theme.breakpoints.down(991)]: {
                        width: 'calc(100% - 80px)',
                        mx: '40px',
                        flexDirection: 'column'
                    },
                    [theme.breakpoints.down(769)]: {
                        width: 'calc(100% - 40px)',
                        mx: '20px'
                    },
                }}>
                <Button component={Link} to={'https://clck.ru/34Vm62'} target='_blank' sx={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: 'rgba(255, 255, 255, 1)',
                    px: '15px',
                    py: '10px',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    [theme.breakpoints.down(769)]: {
                        maxWidth: '260px',
                        fontSize: '15px'
                    }
                }}>
                    125009, Россия, Москва Вознесенский пер. 11. стр. 2
                </Button>
                <Button component={Link} to={'tel:+7 495 988-30-80'} target='_blank' sx={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: 'rgba(255, 255, 255, 1)',
                    px: '15px',
                    py: '10px',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    [theme.breakpoints.down(769)]: {
                        maxWidth: '260px',
                        fontSize: '15px'
                    }
                }}>
                    +7 495 988-30-80
                </Button>
                <Button component={Link} to={'mailto:info@moscow-creative.ru'} target='_blank' sx={{
                    textAlign: 'center',
                    fontWeight: '400',
                    color: 'rgba(255, 255, 255, 1)',
                    px: '15px',
                    py: '10px',
                    '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0)',
                        color: 'rgba(255, 255, 255, 0.8)'
                    },
                    [theme.breakpoints.down(769)]: {
                        maxWidth: '260px',
                        fontSize: '15px'
                    }
                }}>
                    info@moscow-creative.ru
                </Button>
            </Box>
        </Box>
    );
}

export default Footer;
