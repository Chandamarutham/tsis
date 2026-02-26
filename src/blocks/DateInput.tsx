import { useContext } from 'react';
import DatePicker from 'react-datepicker';

import type { BlockProps } from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/blockStyles.module.css';

type DateInputProps = Omit<BlockProps<Date | null>, 'placeholder' | 'inputRange'> & {
    id?: string;
    name?: string;
    dateFormat?: string;
    minDate?: Date;
    maxDate?: Date;
    showYearDropdown?: boolean;
    showMonthDropdown?: boolean;
    yearDropdownItemNumber?: number;
};

export default function DateInput({
    legend,
    value,
    onChange,
    hasError,
    disabled = false,
    required = false,
    className = '',
    id,
    name,
    dateFormat = 'dd/MM/yyyy',
    minDate,
    maxDate,
    showYearDropdown = true,
    showMonthDropdown = true,
    yearDropdownItemNumber = 100,
}: DateInputProps) {
    const lang: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';
    const inputName = name || legend.toLowerCase().replace(/\s+/g, '_');
    const inputId = id || inputName;

    const handleDateChange = (date: Date | null) => {
        onChange(date);
    };

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
                <DatePicker
                    id={inputId}
                    name={inputName}
                    selected={value}
                    onChange={handleDateChange}
                    dateFormat={dateFormat}
                    minDate={minDate}
                    maxDate={maxDate}
                    showYearDropdown={showYearDropdown}
                    showMonthDropdown={showMonthDropdown}
                    dropdownMode="select"
                    yearDropdownItemNumber={yearDropdownItemNumber}
                    className={styles.dtp_input}
                    wrapperClassName={styles.dtp_wrapper}
                    disabled={disabled}
                />
            </div>
        </fieldset>
    );
}
