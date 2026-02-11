import {
    useMemo,
    useState,
    useContext
} from 'react';

import type { FormErrors } from '@typedef/FormErrors';
import type {
    BlockProps,
    LabelObject
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import styles from '@styles/CheckboxInput.module.css';

type CheckboxInputProps = Omit<BlockProps<number[]>, 'inputRange'> & {
    inputRange?: LabelObject[];
};

export default function CheckboxInput({
    legend,
    onChange,
    onError,
    inputRange,
    disabled = false,
    required = false,
    className = '',
    validate,
}: CheckboxInputProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [selectedIndices, setSelectedIndices] = useState<number[]>([]);

    const lang: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';

    const options = useMemo(() => (
        inputRange?.map((item, index) => ({
            label: item[lang],
            value: index,
        })) ?? []
    ), [inputRange, lang]);

    const emitChange = (value: number[]) => {
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

    const handleToggle = (index: number) => (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const validIndices = selectedIndices.filter(
            (item) => item >= 0 && item < options.length
        );
        const nextSet = new Set(validIndices);

        if (event.target.checked) {
            nextSet.add(index);
        } else {
            nextSet.delete(index);
        }

        const nextIndices = Array.from(nextSet).sort((a, b) => a - b);
        setSelectedIndices(nextIndices);
        emitChange(nextIndices);
    };

    const hasErrors = Object.keys(errors).length > 0;
    const selectedSet = new Set(
        selectedIndices.filter(
            (item) => item >= 0 && item < options.length
        )
    );

    return (
        <fieldset
            className={styles.chk_fieldset}
            disabled={disabled}
        >
            <legend
                className={`
                    ${styles.chk_legend}
                    ${lang === 'ta' ? styles.chk_tamilFont : styles.chk_englishFont}
                `}
            >
                {legend} {required && <span className={styles.chk_required}>*</span>}
            </legend>

            <div
                className={`
                    ${styles.chk_group}
                    ${hasErrors ? styles.chk_error : ''}
                `}
            >
                {options.length === 0 ? (
                    <div className={styles.chk_empty}>
                        No options
                    </div>
                ) : (
                    options.map((option) => (
                        <label
                            key={option.value}
                            className={`
                                ${styles.chk_item}
                                ${className}
                            `}
                        >
                            <input
                                type="checkbox"
                                className={styles.chk_checkbox}
                                value={option.value}
                                checked={selectedSet.has(option.value)}
                                onChange={handleToggle(option.value)}
                                disabled={disabled}
                            />
                            <span className={styles.chk_label}>
                                {option.label}
                            </span>
                        </label>
                    ))
                )}
            </div>
        </fieldset>
    );
}
