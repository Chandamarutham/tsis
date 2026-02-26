import {
    useMemo,
    useContext
} from 'react';

import type {
    BlockProps,
    InputRange,
    RangeTuple
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/blockStyles.module.css';

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
    value,
    onChange,
    hasError,
    inputRange,
    disabled = false,
    required = false,
    className = '',
}: BlockProps<number>) {
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

    const handleSelectChange = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const nextIndex = Number(event.target.value);
        onChange(Number.isNaN(nextIndex) ? -1 : nextIndex);
    };

    const selectValue = Number.isInteger(value) && value >= 0 && value < options.length
        ? String(value)
        : '-1';
        
    const placeholderLabel = lang === 'ta' ? 'தேர்ந்தெடு' : 'Select';

    return (
        <fieldset
            className={`
                ${styles.fieldset}
                ${className}
            `}
            disabled={disabled}
        >
            <legend
                className={`
                    ${styles.legend}
                    ${lang === 'ta' ? styles.fontTamil : styles.fontEnglish}
                `}
            >
                {legend} {required && <span className={styles.required}>*</span>}
            </legend>

            <div
                className={`
                    ${styles.group}
                    ${hasError ? styles.error : ''}
                `}
            >
                <select
                    name={`${legend.toLowerCase().replace(/\s+/g, '_')}`}
                    aria-label={legend}
                    className={styles.fieldControl}
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
