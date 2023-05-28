import {createTheme} from '@mui/material';
import '@mui/x-data-grid/themeAugmentation';

export const colors = {
    black: '#0C1622',
    white: '#FFFFFF',
    white2: 'rgba(255, 255, 255, 0.6)',
    white3: 'rgba(255, 255, 255, 0.8)',
    red: '#E74362',
    violet: '#3E2358',
    violet2: '#251535',
    grey: '#242C38',
    blue1: '#DBE6F0',
    blue2: '#375B75',
    blue2_2: '#2C495E',
    black1: '#000000',
    black2: '#272727',
    black3: '#07131f',
    black4: '#0C1522',
    grey1: '#9C9C9C',
    grey2: '#F5F5F5',
    grey3: '#D9D9D9',
    grey4: '#757575',
    grey5: '#383838',
    main: '#3D7D2D',
    success: '#00AC07',
    error: '#D00000',
};

export let theme = createTheme();

theme = createTheme({
    palette: {
        primary: {
            main: colors.red
        },
        secondary: {
            main: colors.grey1
        },
        error:{
            main:'#f44336'
        },
        warning:{
            main:'#ffea00'
        },
        success:{
            main:'#00c853'
        }
    },
    typography: {
        fontFamily: [
            'Alegreya',
            'Roboto',
            'sans-serif',
            'CeraPro'
        ].join(',')
    },
    components: {
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        MuiButtonBase: {
            styleOverrides: {
                root: {
                    outline: 'none',
                    '&.MuiButton-text': {
                        backgroundColor: 'unset',
                        padding: 0,
                        outline: 'none',
                        '&:hover' : {
                            backgroundColor: 'unset',
                        }
                    },
                    '&.MuiPickersDay-root': {
                        color: colors.white2,
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.04)'
                        },
                        '&:not(.Mui-selected)': {
                            borderColor: colors.white2
                        }
                    }
                }
            }
        },
        MuiSelect: {
            styleOverrides:{
                select: {
                    lineHeight: '23px',
                    height: '23px',
                    minHeight: '23px',
                    color: colors.white3,
                    borderRadius: '7px'
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    borderRadius: '7px',
                    color: colors.white3,
                    '&:hover': {
                        borderColor: '#FFFFFF'
                    },
                    '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.4)'
                    },
                },
                input: {
                    '&.MuiOutlinedInput-input.Mui-disabled': {
                        '-webkit-text-fill-color': 'rgba(255, 255, 255, 0.6)'
                    },
                    [theme.breakpoints.down(769)]: {
                        padding: '11px 14px'
                    }
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    boxShadow: 'none',
                    borderRadius: '7px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: '7px',
                    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                },
                notchedOutline: {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                }
            }
        },
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: 'rgba(255, 255, 255, 0.2)',
                    '&.Mui-disabled': {
                        color: 'rgba(255, 255, 255, 0.2)'
                    },
                    [theme.breakpoints.down(769)]: {
                        top: '-5.5px'
                    }
                }
            }
        },
        MuiSvgIcon: {
            styleOverrides: {
                root: {
                    fill: 'rgba(255, 255, 255, 1)',
                    '&.MuiDropzoneArea-icon': {
                        fill: colors.blue2_2
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    //fontSize: 24,
                    backgroundColor: colors.blue2_2,
                    borderRadius: '7px',
                    color: colors.white
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    borderRadius: '0px',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0px 1px 4px rgba(255, 255, 255, 0.2)'
                }
            }
        },
        MuiListItemButton: {
            styleOverrides: {
                root: {
                    padding: '0px',
                    flex: 'auto',
                    '& .MuiTypography-root': {
                        color: colors.white,
                        padding: '0px 0px',
                        margin: '0px 0px'
                    }
                }
            }
        },
        MuiTypography: {
            styleOverrides: {
                root: {
                    color: colors.white,
                    fontWeight: 400,
                    fontSize: 16,
                    lineHeight: '18px',
                    letterSpacing: '0px',
                    //padding: '0px 10px'
                    '&.MuiDayCalendar-weekDayLabel': {
                        color: colors.white3
                    },
                    '&.MuiDropzoneArea-text': {
                        color: colors.blue2_2
                    },
                    [theme.breakpoints.down(1025)]: {
                        fontSize: '15px'
                    },
                },
                h3: {
                    color: colors.white,
                    fontSize: '56px',
                    lineHeight: 1,
                    [theme.breakpoints.down(1025)]: {
                        fontSize: '50px',
                        lineHeight: 1,
                    },
                    [theme.breakpoints.down(991)]: {
                        fontSize: '44px',
                        lineHeight: 1,
                    },
                    [theme.breakpoints.down(769)]: {
                        fontSize: '24px',
                        lineHeight: 1,
                    },
                },
                h5: {
                    fontSize: 32,
                    lineHeight: 1,
                    color: colors.white,
                    [theme.breakpoints.down(1025)]: {
                        fontSize: '32px'
                    },
                },
                overline: {
                    display: 'none'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                root: {
                    minWidth: 'fit-content',
                    padding: '0px',
                    margin: '0px 0px'
                },
                primary: {
                    margin: '14px 0px',
                    [theme.breakpoints.down(791)]: {
                        fontSize: '20px',
                        margin: '14px 0px'
                    }
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    minWidth: 88,
                    textTransform: 'unset',
                    fontWeight: '700',
                    fontSize: '17px',
                    lineHeight: '20px',
                    //letterSpacing: '0.04em',
                    padding: '18px 30px',
                    boxShadow: 'none',
                    borderRadius: '7px',
                    '&.Mui-disabled': {
                        backgroundColor: colors.blue2_2
                    }
                },
                textPrimary: {
                    color: colors.white3,
                    backgroundColor: 'rgba(255, 255, 255, 0)',
                    '&:hover': {
                        color: colors.white,
                        backgroundColor: colors.red,
                    }
                },
                containedPrimary: {
                    color: colors.white3
                },
                containedSecondary: {
                    color: colors.white
                },
                sizeLarge: {
                    [theme.breakpoints.down(769)]: {
                        fontSize: '15px',
                        lineHeight: '15px',
                        padding: '15px 20px',
                    },
                }
            }
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    '& .MuiInput-input:focus': {
                        backgroundColor: 'unset'
                    }
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                root: {
                    //backgroundColor: colors.blue2_2
                }
            }
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontSize: 12,
                        fontWeight: 500,
                        color: colors.blue1,
                        whiteSpace: 'break-spaces',
                        lineHeight: 1.25
                    },
                    '& .MuiDataGrid-cellContent': {
                        whiteSpace: 'break-spaces',
                        lineHeight: 1.25,
                        color: colors.white3,
                        minWidth: 'fit-content'
                    },
                    '& .MuiDataGrid-cell:focus, & .MuiDataGrid-columnHeader:focus': {
                        outline: 0
                    },
                    '& .MuiDataGrid-cell:focus-within': {
                        outline: 0
                    },
                    '& .MuiDataGrid-columnSeparator': {
                        display: 'none'
                    },
                    '& .MuiFormControl-root': {
                        paddingTop: 15,
                        paddingBottom: 15,
                    },
                    '& .MuiInput-underline': {
                        fontSize: 14,
                        lineHeight: 20
                    },
                    '& .MuiIconButton-root': {
                        color: colors.white3
                    },
                    '& .MuiDataGrid-withBorderColor': {
                        borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '& .MuiDataGrid-row:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.04)'
                    },
                    
                }
            }
        },
        MuiMenuItem: {
            styleOverrides: {
                root: {
                    paddingTop: '4px',
                    paddingBottom: '4px'
                }
            }
        }
    }
});
