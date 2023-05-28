import {DatePickerProps, DatePicker} from '@mui/x-date-pickers';
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import 'moment/locale/ru';
import {Controller, useFormContext} from 'react-hook-form';

/**
 * Базовый компонент DatePicker
 *
 * @param {string} name название компонента используется в Controller
 * @param {string} returnedFormat формат в котором вернется значение после выбора даты
 * @param {string} [defaultHelperText] вспомогательный текст
 */
export type TDatePickerProps = {
    name: string,
    returnedFormat: string,
    defaultHelperText?: string
} & DatePickerProps<any>;

function DatePickerComponent({name, returnedFormat, defaultHelperText, ...otherProps}: TDatePickerProps) {
    const {
        control,
        formState: {errors},
    } = useFormContext();

    return (
        <Controller
            defaultValue=''
            name={name}
            control={control}
            render={({field}) =>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <DatePicker
                        {...otherProps}
                        {...field}
                        views={['year', 'month', 'day']}
                        value={field.value ?
                            moment(field.value, returnedFormat) :
                            null}
                        slotProps={{
                            textField: {
                                error: !!errors[name],
                                variant: 'outlined',
                                helperText: errors[name] ?
                                    errors[name]?.message as string :
                                    defaultHelperText
                            },
                        }}
                        onChange={(e) => {
                            if (e) {
                                const formattedDate = moment(e).format(returnedFormat);
                                field.onChange(formattedDate);
                            } else {
                                field.onChange(null);
                            }
                        }}
                    />
                </LocalizationProvider>
            }
        />
    );
}

export default DatePickerComponent;
