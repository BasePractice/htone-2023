import {TextField} from '@mui/material';
import {Controller, useFormContext} from 'react-hook-form';
import {TTextFieldProps} from './types';

/**
 * Компонент обёртка для TextField - поле ввода текста
 * @param name
 * @param defaultHelperText
 * @param otherProps
 * @constructor
 */
function TextFieldComponent({name, defaultHelperText, ...otherProps}: TTextFieldProps) {
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
                <TextField
                    {...otherProps}
                    {...field}
                    variant="outlined"
                    helperText={errors[name] ?
                        errors[name]?.message as string :
                        defaultHelperText}
                    error={!!errors[name]}
                    onChange={(e) => {
                        if (e) {
                            const formatted = otherProps.type === 'number' ?
                                Number(e.target.value) :
                                String(e.target.value);
                            field.onChange(formatted);
                        } else {
                            field.onChange(null);
                        }
                    }}
                />}
        />
    );
}

export default TextFieldComponent;
