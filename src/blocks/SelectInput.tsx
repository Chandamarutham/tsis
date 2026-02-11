import {
    useMemo,
    useState,
    useContext
} from 'react';

import type { FormErrors } from '@typedef/FormErrors';
import type {
    BlockProps,
    InputRange,
    RangeTuple
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/SelectInput.module.css';

type SelectOption = {
    label: string;
    value: string;
};

const isRangeTuple = (inputRange?: InputRange): inputRange is RangeTuple => (
    Array.isArray(inputRange)
    && inputRange.length === 2
    && inputRange.every((item) => Number.isInteger(item))
);

const buildRangeOptions = (min: number, max: number): SelectOption[] => {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
        return [];
    }
    const options: SelectOption[] = [];
    const step = min <= max ? 1 : -1;
    let index = 0;
    for (
        let value = min;
        step > 0 ? value <= max : value >= max;
        value += step
    ) {
        options.push({
            label: String(value),
            value: String(index),
        });
        index += 1;
    }
    return options;
};

export default function SelectInput({
    legend,
    onChange,
    onError,
    inputRange,
    disabled = false,
    required = false,
    className = '',
    validate,
}: BlockProps<number>) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const lang: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';

    const options = useMemo(() => {
        if (!inputRange) {
            return [];
        }
        if (isRangeTuple(inputRange)) {
            const [min, max] = inputRange;
            return buildRangeOptions(min, max);
        }
        return inputRange.map((item, index) => {
            if (typeof item === 'string') {
                return {
                    label: item,
                    value: String(index),
                };
            }
            return {
                label: item[lang],
                value: String(index),
            };
        });
    }, [inputRange, lang]);

    const emitChange = (value: number) => {
        if (validate) {
            const nextErrors = validate(value);
            setErrors(nextErrors);
            onError(nextErrors);
        } else {
            setErrors({});
            onError({});
        }
        onChange(value);
    };

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const nextIndex = Number(event.target.value);
        setSelectedIndex(nextIndex);

        if (nextIndex === -1) {
            emitChange(-1);
            return;
        }
        emitChange(nextIndex);
    };

    const hasErrors = Object.keys(errors).length > 0;

    const selectValue = selectedIndex >= 0 && selectedIndex < options.length
        ? String(selectedIndex)
        : '-1';
        
    const placeholderLabel = lang === 'ta' ? 'தேர்ந்தெடு' : 'Select';

    return (
        <fieldset
            className={`
                ${styles.sel_fieldset}
                ${className}
            `}
            disabled={disabled}
        >
            <legend
                className={`
                    ${styles.sel_legend}
                    ${lang === 'ta' ? styles.sel_tamilFont : styles.sel_englishFont}
                `}
            >
                {legend} {required && <span className={styles.sel_required}>*</span>}
            </legend>

            <div
                className={`
                    ${styles.sel_group}
                    ${hasErrors ? styles.sel_error : ''}
                `}
            >
                <select
                    aria-label={legend}
                    className={styles.sel_select}
                    value={selectValue}
                    onChange={handleSelectChange}
                    disabled={disabled}
                >
                    {options.length === 0 ? (
                        <option value="-1" disabled>
                            No options
                        </option>
                    ) : (
                        <option value="-1" disabled={required}>
                            {placeholderLabel}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
        </fieldset>
    );
}
