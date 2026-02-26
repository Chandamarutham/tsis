import {
    useContext
} from 'react';

import type { BlockProps } from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/blockStyles.module.css';

export default function InputBox({
    legend,
    value,
    onChange,
    hasError,
    placeholder = '',
    disabled = false,
    required = false,
    className = '',
}: BlockProps<string>) {

    const lang: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';

    const emitChange = (nextValue: string) => {
        onChange(nextValue);
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        emitChange(event.target.value);
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
                <input
                    name={`${legend.toLowerCase().replace(/\s+/g, '_')}`}
                    aria-label={legend}
                    className={styles.field}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    disabled={disabled}
                />
            </div>
        </fieldset>
    );
}
