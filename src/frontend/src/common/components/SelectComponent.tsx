import {FormControl, InputLabel, MenuItem, Select, SelectProps} from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';
import {ReactNode} from 'react';
import {Controller, useFormContext} from 'react-hook-form';
import {TUniversalOption} from './types';

/**
 * Базовый компонент Select
 *
 * @param {string} name название компонента используется в Controller
 * @param {TUniversalOption[] | undefined} options опции для select
 * @param {string | number} [valueKey] ключ/value элемента массива опций
 * @param {string} [labelKey] отображаемое значение элемента массива опций
 * @param {string} [defaultHelperText] вспомогательный текст
 * @param {boolean} [controlled] индикатор возвращаемого компонента
 */
type TSelectProps = {
    name: string,
    options: TUniversalOption[] | undefined,
    valueKey?: string | number,
    labelKey?: string,
    defaultHelperText?: string,
    controlled?: boolean
} & SelectProps;

function SelectComponent({
    name,
    defaultHelperText,
    options,
    valueKey = 'value',
    labelKey = 'label',
    controlled,
    ...otherProps
}: TSelectProps) {
    const mapOptions = (): ReactNode[] => {
        if (options) {
            return options.map((option, index) =>
                (<MenuItem key={option[valueKey] + index} value={option[valueKey]}>{option[labelKey]}</MenuItem>));
        }
        return [];
    };

    if (controlled) {
        const {
            control,
            formState: {errors},
        } = useFormContext();

        return (
            <Controller
                defaultValue=''
                name={name}
                control={control}
                render={({field}) => (
                    <FormControl fullWidth>
                        <InputLabel className={errors[name] && 'Mui-error'}>{otherProps.required ?
                            `${otherProps.label} *` :
                            otherProps.label}</InputLabel>
                        <Select
                            {...otherProps}
                            {...field}
                            children={mapOptions()}
                            error={!!errors[name]}
                        />
                        <FormHelperText error={!!errors[name]}>
                            {errors[name] ?
                                (errors[name]?.message as string) :
                                defaultHelperText}
                        </FormHelperText>
                    </FormControl>
                )}
            />
        );
    }

    return (
        <FormControl fullWidth variant="standard">
            <InputLabel>{otherProps.required ?
                `${otherProps.label} *` :
                otherProps.label}</InputLabel>
            <Select {...otherProps} variant={'standard'} children={mapOptions()} />
            <FormHelperText>{defaultHelperText}</FormHelperText>
        </FormControl>
    );
}

export default SelectComponent;
