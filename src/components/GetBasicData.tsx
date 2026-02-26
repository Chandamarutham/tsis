import { useState, useContext } from 'react';

import InputBox from '@blocks/InputBox';
import SelectInput from '@blocks/SelectInput';
import CheckboxInput from '@blocks/CheckboxInput';
import DateInput from '@blocks/DateInput';

import { LanguageContext } from '@utils/languageContext';
import { ShishyaDataContext } from '@utils/useShishyaData';
import { FormState } from '@typedef/FormState';
import type { FormErrors } from '@typedef/FormErrors';
import type { NewFormProps } from '@typedef/ShishyaData';

import {
    panchasamskaram,
    genders,
    marriageStatuses,
    tamilMonths,
    birthStars,
    professions,
    interests,
} from '@constants/optionConstants';

import styles from '@styles/addShishyaCompStyles.module.css';

type TextField =
    | 'email'
    | 'poorvikam'
    | 'gotram'
    | 'job_details';

type SelectField =
    | 'panchasamskaram'
    | 'gender'
    | 'marital_status'
    | 'tamil_month'
    | 'birthstar'
    | 'profession';

export default function GetBasicData({
    setParentState,
    displayErrors,
}: NewFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const shishyaContext = useContext(ShishyaDataContext);
    const language: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === 'ta' ? 'font-tamil' : 'font-english';

    if (!shishyaContext) {
        return null;
    }

    const { data, updateData } = shishyaContext;
    const currentData = data.details;

    const resetControllingStates = () => {
        setErrors({});
        displayErrors({});
        setIsSubmitting(false);
    };

    const clearErrors = () => {
        setErrors({});
        displayErrors({});
    };

    const validateForm = () => {
        const newErrors: FormErrors = {};

        if (
            currentData.email
            && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(currentData.email)
        ) {
            newErrors.email = {
                en: 'Invalid email address!',
                ta: 'தவறான மின்னஞ்சல் முகவரி!',
            }[language];
        }

        if (currentData.panchasamskaram === -1) {
            newErrors.panchasamskaram = {
                en: 'Panchasamskaram info is required!',
                ta: 'பஞ்சஸம்ஸ்கார விவரம் குறிப்பிடப்பட வேண்டும்!',
            }[language];
        }

        if (!currentData.date_of_birth) {
            newErrors.date_of_birth = {
                en: 'Date of birth is required!',
                ta: 'பிறந்த தேதி குறிப்பிடப்பட வேண்டும்!',
            }[language];
        }

        if (currentData.gender === -1) {
            newErrors.gender = {
                en: 'Gender is required!',
                ta: 'பாலினம் குறிப்பிடப்பட வேண்டும்!',
            }[language];
        }

        if (currentData.marital_status === -1) {
            newErrors.marital_status = {
                en: 'Marital status is required!',
                ta: 'திருமண நிலை குறிப்பிடப்பட வேண்டும்!',
            }[language];
        }

        if (currentData.poorvikam.trim().length === 0) {
            newErrors.poorvikam = {
                en: 'Native place is required!',
                ta: 'பூர்விகம் குறிப்பிடப்பட வேண்டும்!',
            }[language];
        }

        setErrors(newErrors);
        displayErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleTextChange = (field: TextField, value: string) => {
        clearErrors();
        updateData({
            details: {
                ...currentData,
                [field]: value,
            },
        });
    };

    const handleSelectChange = (field: SelectField, value: number) => {
        clearErrors();
        updateData({
            details: {
                ...currentData,
                [field]: value,
            },
        });
    };

    const handleDateChange = (date: Date | null) => {
        clearErrors();
        updateData({
            details: {
                ...currentData,
                date_of_birth: date,
            },
        });
    };

    const handleInterestsChange = (value: number, checked: boolean) => {
        const existing = currentData.interests;
        const updatedInterests = checked
            ? Array.from(new Set([...existing, value]))
            : existing.filter((interest) => interest !== value);

        updateData({
            details: {
                ...currentData,
                interests: updatedInterests,
            },
        });
        displayErrors({});
    };

    const handlePrev = () => {
        setParentState(FormState.GET_ADDRESS);
        resetControllingStates();
    };

    const handleNext = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetControllingStates();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        setParentState(FormState.GET_FAMILY);
        setIsSubmitting(false);
        resetControllingStates();
    };

    return (
        <form className={styles.form} onSubmit={handleNext} noValidate>
            <div className={styles.gridLayout}>
                <div className={styles.spans3Columns}>
                    <InputBox
                        legend={{ en: 'Email ID', ta: 'மின்னஞ்சல்' }[language]}
                        value={currentData.email}
                        onChange={(value) => {
                            handleTextChange('email', value);
                        }}
                        hasError={!!errors.email}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Panchasamskaram', ta: 'பஞ்சஸம்ஸ்காரம்' }[language]}
                        value={currentData.panchasamskaram}
                        onChange={(value) => {
                            handleSelectChange('panchasamskaram', value);
                        }}
                        hasError={!!errors.panchasamskaram}
                        inputRange={panchasamskaram}
                        required={true}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <DateInput
                        legend={{ en: 'Birth Date', ta: 'பிறந்ததேதி' }[language]}
                        value={currentData.date_of_birth}
                        onChange={handleDateChange}
                        hasError={!!errors.date_of_birth}
                        required={true}
                        id="date_of_birth"
                        name="date_of_birth"
                        dateFormat="dd/MM/yyyy"
                        maxDate={new Date()}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Gender', ta: 'பாலினம்' }[language]}
                        value={currentData.gender}
                        onChange={(value) => {
                            handleSelectChange('gender', value);
                        }}
                        hasError={!!errors.gender}
                        inputRange={genders}
                        required={true}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Marriage', ta: 'திருமணம்' }[language]}
                        value={currentData.marital_status}
                        onChange={(value) => {
                            handleSelectChange('marital_status', value);
                        }}
                        hasError={!!errors.marital_status}
                        inputRange={marriageStatuses}
                        required={true}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <InputBox
                        legend={{ en: 'Native', ta: 'பூர்வீகம்' }[language]}
                        value={currentData.poorvikam}
                        onChange={(value) => {
                            handleTextChange('poorvikam', value);
                        }}
                        hasError={!!errors.poorvikam}
                        required={true}
                    />
                </div>
                <p className={`
                    ${styles.fineprint} 
                    ${styles.spans3Columns} 
                    ${font_style}
                `}>
                    {{
                        en: '(If Native is not known please enter "Not Known")',
                        ta: '(பூர்வீகம் தெரியாதென்றால் "தெரியாது" என பதியவும்)',
                    }[language]}
                </p>

                <div className={styles.spans3Columns}>
                    <InputBox
                        legend={{ en: 'Gotram', ta: 'கோத்ரம்' }[language]}
                        value={currentData.gotram}
                        onChange={(value) => {
                            handleTextChange('gotram', value);
                        }}
                        hasError={false}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Birth Month', ta: 'பிறந்த மாதம்' }[language]}
                        value={currentData.tamil_month}
                        onChange={(value) => {
                            handleSelectChange('tamil_month', value);
                        }}
                        hasError={false}
                        inputRange={tamilMonths}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Birth Star', ta: 'நக்ஷத்திரம்' }[language]}
                        value={currentData.birthstar}
                        onChange={(value) => {
                            handleSelectChange('birthstar', value);
                        }}
                        hasError={false}
                        inputRange={birthStars}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <SelectInput
                        legend={{ en: 'Profession', ta: 'தொழில்' }[language]}
                        value={currentData.profession}
                        onChange={(value) => {
                            handleSelectChange('profession', value);
                        }}
                        hasError={false}
                        inputRange={professions}
                    />
                </div>

                <div className={styles.spans3Columns}>
                    <InputBox
                        legend={{ en: 'Job Details', ta: 'வேலை விவரங்கள்' }[language]}
                        value={currentData.job_details}
                        onChange={(value) => {
                            handleTextChange('job_details', value);
                        }}
                        hasError={false}
                        placeholder={{ en: 'Job Details', ta: 'வேலை விவரங்கள்' }[language]}
                    />
                </div>

                <hr
                    className={`
                        ${styles.separator}
                        ${styles.spansFullWidth}
                    `}
                />

                <div
                    className={`
                        ${styles.checkboxGroup}
                        ${styles.spansFullWidth}
                    `}
                >
                    <label className={`${styles.checkboxTitle} ${font_style} wrap-break-word`}>
                        {{ en: 'Extra Curricular', ta: 'தனித் திறமைகள்' }[language]}
                    </label>
                    <div className={styles.checkboxContainer}>
                        {interests.map((option, index) => (
                            <CheckboxInput
                                key={`interest_${index}`}
                                legend=""
                                value={currentData.interests.includes(index)}
                                onChange={(checked) => {
                                    handleInterestsChange(index, checked);
                                }}
                                hasError={false}
                                label={option}
                            />
                        ))}
                    </div>
                </div>

                <hr
                    className={`
                        ${styles.separator}
                        ${styles.spansFullWidth}
                    `}
                />

                <button
                    type="button"
                    className={`
                        ${styles.prevButton} 
                        ${language === 'ta' 
                            ? styles.fontTamil 
                            : styles.fontEnglish
                        }
                    `}
                    onClick={handlePrev}
                >
                    {`← ${{ en: 'Previous', ta: 'முந்தையது' }[language]}`}
                </button>

                <button
                    type="submit"
                    className={`
                        ${styles.nextButton}
                        ${isSubmitting ? styles.buttonDisabled : ''}
                        ${language === 'ta' 
                            ? styles.fontTamil 
                            : styles.fontEnglish
                        }
                    `}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? `${{ en: 'Wait...', ta: 'பொறுக்கவும்...' }[language]}`
                        : `${{ en: 'Next →', ta: 'அடுத்தது →' }[language]}`}
                </button>
            </div>
        </form>
    );
}
