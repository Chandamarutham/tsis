import { useState, useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';
import { FormState } from '@typedef/FormState';

import type { FormErrors } from '@typedef/FormErrors';
import type {
    PreferencesType,
    FormProps,
} from '@typedef/ShishyaData';

import participation from '@constants/participation.json';
import addressitem from '@constants/addresses.json';

import styles from '@styles/GetPreferences.module.css';


export default function GetPreferences(
    {setParentState, currentData, updateParent, displayErrors}: FormProps<PreferencesType>
) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);    
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";
    const width6_limit: string = "md:max-w-78 lg:max-w-78 ml-auto";
    const addr_for_comm: number = currentData.contact_current_address ? 0 : 1;

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
        // Add validation logic here if needed
        // For now, no required fields in this form
        setErrors(newErrors);
        displayErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    {/* -----------------
        Event Handlers 
        ----------------- */}
    const handleCheckboxChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        e.preventDefault();
        setErrors({});
        displayErrors({});
        const field: keyof PreferencesType = e.target.name as keyof PreferencesType;
        updateParent({
            ...currentData,
            [field]: e.target.checked
        });
    };

    const handleSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        e.preventDefault();
        setErrors({});
        displayErrors({});
        const field: keyof PreferencesType = e.target.name as keyof PreferencesType;
        const value: number = parseInt(e.target.value);
        updateParent({
            ...currentData,
            [field]: value === 0 ? true : false
        });
    };

    const handleParticipationInterestsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const value = parseInt(e.target.value);
        let updatedInterests = [...currentData.programs];
        if (e.target.checked) {
            updatedInterests.push(value);
        } else {
            updatedInterests = updatedInterests.filter(i => i !== value);
        }
        updateParent({
            ...currentData,
            programs: updatedInterests
        });
    };

    const handlePrev = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        setParentState(FormState.GET_FAMILY);
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
        setParentState(FormState.GET_CONFIRMATION);
        setIsSubmitting(false);
        resetControllingStates();        
    };    
    return(
        <form className={styles.form} onSubmit={handleNext}>
            <div className={styles.gridLayout}>
                {/* Section Title */}
                <div className={`${styles.formGroup} ${styles.spansFullWidth}`}>
                    <h3 className={`${styles.sectionTitle} ${font_style}`}>
                        {{'en': 'Permissions', 'ta': 'அனுமதி'}[language]}
                    </h3>
                </div>

                {/* WhatsApp Group */}
                <div className={`${styles.formGroup} ${styles.spans4Columns} ${styles.startsAtColumn4}`}>
                    <div className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            id="wagroup_optin"
                            name="wagroup_optin"
                            checked={currentData.wagroup_optin}
                            onChange={handleCheckboxChange}
                            className={styles.checkboxInput}
                        />
                        <label 
                            htmlFor="wagroup_optin"
                            className={`${styles.checkboxLabel} ${font_style}`}
                        >
                            {{'en': 'Include in WhatsApp Group', 'ta': 'வாட்ஸ்அப் குழுவில் சேர்க்கவும்'}[language]}
                        </label>
                    </div>
                </div>

                {/* WhatsApp One-to-One */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <div className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            id="whatsapp_optin"
                            name="whatsapp_optin"
                            checked={currentData.whatsapp_optin}
                            onChange={handleCheckboxChange}
                            className={styles.checkboxInput}
                        />
                        <label 
                            htmlFor="whatsapp_optin"
                            className={`${styles.checkboxLabel} ${font_style}`}
                        >
                            {{'en': 'One-to-one WhatsApp Messages', 'ta': 'தனிப்பட்ட வாட்ஸ்அப் செய்தி'}[language]}
                        </label>
                    </div>
                </div>

                {/* Email Contact */}
                <div className={`${styles.formGroup} ${styles.spans4Columns} ${styles.startsAtColumn4}`}>
                    <div className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            id="email_optin"
                            name="email_optin"
                            checked={currentData.email_optin}
                            onChange={handleCheckboxChange}
                            className={styles.checkboxInput}
                        />
                        <label 
                            htmlFor="email_optin"
                            className={`${styles.checkboxLabel} ${font_style}`}
                        >
                            {{'en': 'Contact via email', 'ta': 'மின்னஞ்சல் மூலம் தொடர்பு'}[language]}
                        </label>
                    </div>
                </div>

                {/* Phone Contact */}
                <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                    <div className={styles.checkboxItem}>
                        <input
                            type="checkbox"
                            id="calls_optin"
                            name="calls_optin"
                            checked={currentData.calls_optin}
                            onChange={handleCheckboxChange}
                            className={styles.checkboxInput}
                        />
                        <label 
                            htmlFor="calls_optin"
                            className={`${styles.checkboxLabel} ${font_style}`}
                        >
                            {{'en': 'Contact via phone call', 'ta': 'தொலைபேசி மூலம் தொடர்பு'}[language]}
                        </label>
                    </div>
                </div>

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Address for Communication */}
                <div className={`${styles.formGroup} ${styles.spans6Columns} ${styles.startsAtColumn5}`}>
                    <label 
                        htmlFor="contact_current_address"
                        className={`${styles.formLabel} ${font_style}`}
                    >
                        {{'en': 'Address for Communication', 'ta': 'தொடர்புக்கான முகவரி'}[language]}
                    </label>
                    <select
                        id="contact_current_address"
                        name="contact_current_address"
                        value={addr_for_comm}
                        onChange={handleSelectChange}
                        className={`${styles.selectField} ${width6_limit} ${font_style}`}
                    >
                        {addressitem.type.map(
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

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Participation Interests */}
                <div className={`${styles.checkboxGroup} ${styles.spansFullWidth}`}>
                    <label 
                        className={`${styles.checkboxTitle} ${font_style} wrap-break-word`}
                    >
                        {{'en': 'Usual Participation', 'ta': 'வழக்கமாக பங்கேற்கும் நிகழ்வுகள்'}[language]}
                    </label>
                    <div className={styles.checkboxContainer}>
                        {participation.list.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <div 
                                    key={index} 
                                    className={styles.checkboxItem}
                                >
                                    <input
                                        type="checkbox"
                                        id={`participation_${index}`}
                                        name="programs"
                                        value={index}
                                        checked={currentData.programs.includes(index)}
                                        onChange={handleParticipationInterestsChange}
                                        className={styles.checkboxInput}
                                    />
                                    <label 
                                        htmlFor={`participation_${index}`}
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
            {
                Object.keys(errors).length > 0 && 
                <span className={`${styles.error} ${font_style}`}>
                    {Object.values(errors)[0]}
                </span>
            }
        </form>
    );
}
