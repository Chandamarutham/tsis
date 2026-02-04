import { useState, useContext } from 'react';
import { DatePicker } from 'react-datepicker';

import { LanguageContext } from '@utils/languageContext';
import { FormState } from '@typedef/FormState';
import { type FormErrors } from '@typedef/FormErrors';
import type {
    BasicDataType,
    FormProps
} from '@typedef/ShishyaData';

import panchasamskaram from '@constants/panchasamskaram.json';
import genders from '@constants/genders.json';
import marriage from '@constants/marriage.json';
import months from '@constants/tamil_months.json';
import stars from '@constants/birthstars.json';
import professions from '@constants/professions.json';
import interests from '@constants/interests.json';


import "react-datepicker/dist/react-datepicker.css";
import styles from '@styles/GetBasicData.module.css';


export default function GetBasicData(
    { setParentState, currentData, updateParent, displayErrors }: FormProps<BasicDataType>
) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);    
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";
    const width6_limit: string = "md:max-w-78 lg:max-w-78 ml-auto";
    const width4_limit: string = "md:max-w-47 lg:max-w-47 ml-auto"; 
    
    {/* -----------------
        Helper Functions 
        ----------------- */}
    // Reset controlling states
    const resetControllingStates = () => {
        setErrors({});
        displayErrors({});
        setIsSubmitting(false);
    }

    // Validate data entered in form
    const validateForm = () => {
        const newErrors: FormErrors = {};
        // Add validation logic here
        if (currentData.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(currentData.email)) {
            newErrors.email = {
                "en": "Invalid email address!",
                "ta": "தவறான மின்னஞ்சல் முகவரி!"
            }[language];
        }
        if (currentData.panchasamskaram === -1) {
            newErrors.panchasamskaram = {
                "en": "Panchasamskaram info is required!",
                "ta": "பஞ்சஸம்ஸ்கார விவரம் குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        if (!currentData.date_of_birth) {
            newErrors.date_of_birth = {
                "en": "Date of birth is required!",
                "ta": "பிறந்த தேதி குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        if (currentData.gender === -1) {
            newErrors.gender = {
                "en": "Gender is required!",
                "ta": "பாலினம் குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        if (currentData.marital_status === -1) {
            newErrors.marital_status = {
                "en": "Marital status is required!",
                "ta": "திருமண நிலை குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        if (currentData.poorvikam.trim().length === 0) {
            newErrors.poorvikam = {
                "en": "Native place is required!",
                "ta": "பூர்விகம் குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }

        setErrors(newErrors);
        displayErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    {/* -----------------
        Event Handlers 
        ----------------- */}
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        e.preventDefault();
        setErrors({});
        displayErrors({});
        const field: keyof BasicDataType = e.target.name as keyof BasicDataType;
        const value: number | string | boolean | Date | null = e.target.value;
        updateParent({
            ...currentData,
            [field]: value
        });
    };

    const handleDateChange = (
        field: keyof BasicDataType,
        date: Date | null
    ) => {
        setErrors({});
        displayErrors({});
        updateParent({
            ...currentData,
            [field]: date
        });
    };

    const handleInterestsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(e.target.value);
        let updatedInterests = [...currentData.interests];
        if (e.target.checked) {
            updatedInterests.push(value);
        } else {
            updatedInterests = updatedInterests.filter(i => i !== value);
        }
        updateParent({
            ...currentData,
            interests: updatedInterests
        });
        displayErrors({});
    };

    const handlePrev = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setParentState(FormState.GET_ADDRESS);
        resetControllingStates();        
    };

    const handleNext = (
        e: React.SubmitEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        resetControllingStates();
        setIsSubmitting(true);
        if (!validateForm()){
            setIsSubmitting(false);
            return;
        }        
        setParentState(FormState.GET_FAMILY);
        setIsSubmitting(false);
        resetControllingStates();        
    };
    return(
        <form className={styles.form} onSubmit={handleNext} noValidate>
            <div className={styles.gridLayout}>
                {/* Email Field */}
                <div className={`${styles.formGroup} ${styles.spans6Columns}`}>
                    <label 
                        htmlFor="email"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Email ID', 'ta': 'மின்னஞ்சல்'}[language]}
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={currentData.email}
                        onChange={handleChange}
                        className={`
                            ${styles.inputField}  
                            ${width6_limit} 
                            ${errors.email ? styles.inputError : ''}
                        `}
                    />
                </div>

                {/* Panchasamskaram Field */}
                <div className={`${styles.formGroup} ${styles.spans6Columns}`}>
                    <label 
                        htmlFor="panchasamskaram"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Panchasamskaram*', 'ta': 'பஞ்சஸம்ஸ்காரம்*'}[language]}
                    </label>
                    <select
                        id="panchasamskaram"
                        name="panchasamskaram"
                        value={currentData.panchasamskaram}
                        onChange={handleChange}
                        className={`
                            ${styles.selectField}  
                            ${width6_limit} 
                            ${errors.panchasamskaram ? styles.inputError : ''} 
                            ${currentData.panchasamskaram === -1 ? styles.placeholderStyle : ''}
                            ${font_style}`}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {panchasamskaram.options.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Date of Birth Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label 
                        htmlFor="date_of_birth"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Birth Date*', 'ta': 'பிறந்ததேதி*'}[language]}
                    </label>
                    <DatePicker
                        id="date_of_birth"
                        name="date_of_birth"
                        selected={currentData.date_of_birth}
                        dateFormat={"dd/MM/yyyy"}
                        onChange={(date: Date | null) => handleDateChange("date_of_birth", date)}
                        maxDate={new Date()}
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                        yearDropdownItemNumber={100}
                        className={`
                            ${styles.dateSelectField} 
                            ${width4_limit} 
                            ${errors.date_of_birth ? styles.inputError : ''}
                        `}
                        wrapperClassName={`${styles.datePickerWrapper} ${width4_limit}`}
                    />
                </div>

                {/* Gender Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="gender"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Gender*', 'ta': 'பாலினம்*'}[language]}
                    </label>
                    <select
                        id="gender"
                        name="gender"
                        value={currentData.gender}
                        onChange={handleChange}
                        className={`
                            ${styles.selectField}  
                            ${width4_limit} 
                            ${errors.gender ? styles.inputError : ''} 
                            ${currentData.gender === -1 ? styles.placeholderText : ''}
                            ${font_style}
                        `}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {genders.name.map(
                            (option, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Marital Status Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label 
                        htmlFor="marital_status"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Marriage*', 'ta': 'திருமணம்*'}[language]}
                    </label>
                    <select
                        id="marital_status"
                        name="marital_status"
                        value={currentData.marital_status}
                        onChange={handleChange}
                        className={`
                            ${styles.selectField}  
                            ${width4_limit} 
                            ${errors.marital_status ? styles.inputError : ''}
                            ${currentData.marital_status === -1 ? styles.placeholderText : ''}
                            ${font_style}
                        `}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {marriage.status.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Ancestral Town Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="poorvikam"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Native*', 'ta': 'பூர்வீகம்*'}[language]}
                    </label>
                    <input
                        type="text"
                        id="poorvikam"
                        name="poorvikam"
                        value={currentData.poorvikam}
                        onChange={handleChange}
                        className={`
                            ${styles.inputField} 
                            ${width4_limit} 
                            ${errors.poorvikam ? styles.inputError : ''}
                        `}
                    />
                </div>
                
                {/* Gotram Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="gotram"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Gotram', 'ta': 'கோத்ரம்'}[language]}
                    </label>
                    <input
                        type="text"
                        id="gotram"
                        name="gotram"
                        value={currentData.gotram}
                        onChange={handleChange}
                        className={`${styles.inputField} ${width4_limit}`}
                    />
                </div>

                {/* Tamil Month Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="tamil_month"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Birth Month', 'ta': 'பிறந்த மாதம்'}[language]}
                    </label>
                    <select
                        id="tamil_month"
                        name="tamil_month"
                        value={currentData.tamil_month}
                        onChange={handleChange}
                        className={`
                            ${styles.selectField} 
                            ${width4_limit}
                            ${currentData.tamil_month === -1 ? styles.placeholderText : ''}
                            ${font_style}
                        `}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {months.name.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Birthstar Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="birthstar"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Birth Star', 'ta': 'நக்ஷத்திரம்'}[language]}
                    </label>
                    <select
                        id="birthstar"
                        name="birthstar"
                        value={currentData.birthstar}
                        onChange={handleChange}
                        className={`${styles.selectField} ${width4_limit}`}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {stars.name.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Profession Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <label
                        htmlFor="profession"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Profession', 'ta': 'தொழில்'}[language]}
                    </label>
                    <select
                        id="profession"
                        name="profession"
                        value={currentData.profession}
                        onChange={handleChange}
                        className={`${styles.selectField} ${width4_limit}`}
                    >
                        <option value={-1}>
                            {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                        </option>
                        {professions.name.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <option 
                                    key={index} 
                                    value={index}
                                >
                                    {option[language]}
                                </option>
                            )
                        )}
                    </select>
                </div>

                {/* Job Details Field */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <input
                        type="text"
                        id="job_details"
                        name="job_details"
                        value={currentData.job_details}
                        onChange={handleChange}
                        className={`${styles.inputField}`}
                        placeholder={{'en': 'Job Details', 'ta': 'வேலை விவரங்கள்'}[language]}
                    />
                </div>

                <p className={`${styles.fineprint} ${styles.spansFullWidth} ${font_style} text-left`}>
                    {{'en': '(If Native is not known please enter "Not Known")', 
                      'ta': '(பூர்வீகம் தெரியாதென்றால் "தெரியாது" என பதியவும்)'}[language]}
                </p>
                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Interests Field */}
                <div className={`${styles.checkboxGroup} ${styles.spansFullWidth}`}>
                    <label 
                        className={`${styles.checkboxTitle} ${font_style} wrap-break-word`}
                    >
                        {{'en': 'Extra Curricular', 'ta': 'தனித் திறமைகள்'}[language]}
                    </label>
                    <div className={styles.checkboxContainer}>
                        {interests.list.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <div 
                                    key={index} 
                                    className={styles.checkboxItem}
                                >
                                    <input
                                        type="checkbox"
                                        id={`interest_${index}`}
                                        name="interests"
                                        value={index}
                                        checked={currentData.interests.includes(index)}
                                        onChange={handleInterestsChange}
                                        className={styles.checkboxInput}
                                    />
                                    <label 
                                        htmlFor={`interest_${index}`}
                                        className={`${styles.checkboxLabel} ${font_style}`}
                                    >
                                        {option[language]}
                                    </label>
                                </div>
                            )
                        )}
                    </div>
                </div>

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Previous Button */}
                <button
                    type="button"
                    className={`${styles.prevButton} ${font_style}`}   
                    onClick={handlePrev}
                >
                    {`← ${{'en': 'Previous', 'ta': 'முந்தையது'}[language]}`}
                </button>

                {/* Next Button - Submits */}
                <button
                    type="submit"
                    className={`${styles.nextButton} ${isSubmitting ? styles.buttonDisabled : ''} ${font_style}`}   
                    disabled={isSubmitting}
                >
                    {isSubmitting
                    ? (`${{'en': 'Wait...', 'ta': 'பொறுக்கவும்...'}[language]}`)
                    : (`${{'en': 'Next →', 'ta': 'அடுத்தது →'}[language]}`)
                    }
                </button>     
            </div>
        </form>
    );
}