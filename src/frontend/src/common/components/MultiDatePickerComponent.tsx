import {styled} from '@mui/material/styles';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {PickersDay, PickersDayProps} from '@mui/x-date-pickers/PickersDay';
import {StaticDatePicker} from '@mui/x-date-pickers/StaticDatePicker';
import moment from 'moment/moment';
import * as React from 'react';
import {TDatePickerProps} from './DatePickerComponent';
import 'moment/locale/ru';

const CustomPickersDay = styled(PickersDay, {
    shouldForwardProp: (prop) => prop !== 'selected'
})(({
    theme,
    selected
}) => ({
    ...(selected && {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
        '&:hover, &:focus': {
            backgroundColor: theme.palette.primary.dark
        },
        borderTopLeftRadius: '50%',
        borderBottomLeftRadius: '50%',
        borderTopRightRadius: '50%',
        borderBottomRightRadius: '50%'
    })
}));

export default function MultiDatePicker({
    name,
    returnedFormat,
    defaultHelperText,
    ...otherProps
}: TDatePickerProps) {
    const [values, setValues] = React.useState([moment().date()]);

    const findDate = (dates: number[], date: number) => {
        return dates.find((item) => item === date);
    };

    const findIndexDate = (dates: number[], date: number) => {
        return dates.findIndex((item) => item === date);
    };

    const renderPickerDay = (date: number, selectedDates: number,
        pickersDayProps: JSX.IntrinsicAttributes & PickersDayProps<unknown> & React.RefAttributes<HTMLButtonElement>) => {

        if (!values) {
            return <PickersDay {...pickersDayProps} />;
        }

        const selected = findDate(values, date);

        return (
            <CustomPickersDay
                {...pickersDayProps}
                disableMargin
                day={selected}
            />
        );
    };


    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <StaticDatePicker
                {...otherProps}
                value={values}
                onChange={(newValue) => {
                    //copying the values array 
                    const array = [...values];
                    const date = moment(newValue).date();
                    const index = findIndexDate(array, date);
                    if (index >= 0) {
                        array.splice(index, 1);
                    } else {
                        array.push(date);
                    }
                    setValues(array);
                }}

                /*slots={{
                    day: renderPickerDay()
                }}*/

                views={['year', 'month', 'day']}


                /*onChange={(e) => {
                    if (e) {
                        const formattedDate = moment(e).format(returnedFormat);
                        field.onChange(formattedDate);
                    } else {
                        field.onChange(null);
                    }
                }}*/
            />
        </LocalizationProvider>

    );
}
