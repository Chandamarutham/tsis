import { useContext } from 'react';

import type {
    BlockProps,
    LabelObject
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/blockStyles.module.css';


type CheckboxInputProps = Omit<BlockProps<boolean>, 'inputRange'> & {
    label?: string | LabelObject;
};

export default function CheckboxInput({
    legend,
    value,
    onChange,
    hasError,
    label,
    disabled = false,
    required = false,
    className = '',
}: CheckboxInputProps) {
    const lang: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';
    const showLegend = legend.trim().length > 0;
    const checkboxLabel = typeof label === 'string'
        ? label
        : label?.[lang] ?? '';

    const handleToggle = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.checked);
    };

    return (
        <fieldset
            className={`
                ${styles.fieldset}
                ${styles.noborder}
                ${className}
            `}
            disabled={disabled}
        >
            {showLegend && (
                <legend
                    className={`
                        ${styles.legend}
                        ${lang === 'ta' ? styles.fontTamil : styles.fontEnglish}
                    `}
                >
                    {legend} {required && <span className={styles.required}>*</span>}
                </legend>
            )}

            <div
                className={`
                    ${styles.group}
                    ${styles.noborder}
                    ${hasError ? styles.error : ''}
                `}
            >
                <label className={styles.chk_item}>
                    <input
                        type="checkbox"
                        className={styles.chk_checkbox}
                        checked={value}
                        onChange={handleToggle}
                        disabled={disabled}
                    />
                    <span className={styles.chk_label}>
                        {checkboxLabel}
                    </span>
                </label>
            </div>
        </fieldset>
    );
}
