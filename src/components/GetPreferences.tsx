import { useState, useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';
import { ShishyaDataContext } from '@utils/useShishyaData';
import { FormState } from '@typedef/FormState';
import CheckboxInput from '@blocks/CheckboxInput';
import SelectInput from '@blocks/SelectInput';

import type { FormErrors } from '@typedef/FormErrors';
import type {
    PreferencesType,
    NewFormProps,
} from '@typedef/ShishyaData';

import { 
    participationEvents, 
    addressTypes 
} from '@constants/optionConstants';

import styles from '@styles/addShishyaCompStyles.module.css';


export default function GetPreferences(
    {setParentState, displayErrors}: NewFormProps
) {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);    
    
    const shishyaContext = useContext(ShishyaDataContext);
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    
    const { data, updateData } = shishyaContext || { data: null, updateData: () => {} };
    const currentData = data?.preferences || {} as PreferencesType;
    const addr_for_comm: number = currentData.contact_current_address ? 0 : 1;

    {/* -----------------
        Helper Functions 
        ----------------- */}
    // Reset controlling states
    const resetControllingStates = () => {
        displayErrors({});
        setIsSubmitting(false);
    }

    // Validate data entered in form
    const validateForm = () => {
        const newErrors: FormErrors = {};
        // Add validation logic here if needed
        // For now, no required fields in this form
        displayErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    {/* -----------------
        Event Handlers 
        ----------------- */}
    const handleCheckboxChange = (field: keyof PreferencesType) => (checked: boolean) => {
        displayErrors({});
        updateData({
            preferences: {
                ...currentData,
                [field]: checked
            }
        });
    };

    const handleAddressChange = (index: number) => {
        displayErrors({});
        updateData({
            preferences: {
                ...currentData,
                contact_current_address: index === 0 ? true : false
            }
        });
    };

    const handleParticipationInterestsChange = (value: number) => (checked: boolean) => {
        let updatedInterests = [...currentData.programs];
        if (checked) {
            updatedInterests.push(value);
        } else {
            updatedInterests = updatedInterests.filter(i => i !== value);
        }
        updateData({
            preferences: {
                ...currentData,
                programs: updatedInterests
            }
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
                <div className={styles.spansFullWidth}>
                    <h3 
                        className={`
                            ${styles.sectionTitle} 
                            ${language === "ta" 
                                ? styles.fontTamil 
                                : styles.fontEnglish
                            }
                        `}
                    >
                        {{'en': 'Permissions', 'ta': 'அனுமதி'}[language]}
                    </h3>
                </div>

                {/* WhatsApp Group */}
                <div className={`
                    ${styles.spans4Columns} 
                    ${styles.startsAtColumn4}
                `}>
                    <CheckboxInput
                        legend=""
                        value={currentData.wagroup_optin}
                        onChange={handleCheckboxChange('wagroup_optin')}
                        hasError={false}
                        label={{'en': 'Include in WhatsApp Group', 'ta': 'வாட்ஸ்அப் குழுவில் சேர்க்கவும்'}}
                    />
                </div>

                {/* WhatsApp One-to-One */}
                <div className={styles.spans4Columns}>
                    <CheckboxInput
                        legend=""
                        value={currentData.whatsapp_optin}
                        onChange={handleCheckboxChange('whatsapp_optin')}
                        hasError={false}
                        label={{'en': 'One-to-one WhatsApp Messages', 'ta': 'தனிப்பட்ட வாட்ஸ்அப் செய்தி'}}
                    />
                </div>

                {/* Email Contact */}
                <div className={`
                    ${styles.spans4Columns} 
                    ${styles.startsAtColumn4}
                `}>
                    <CheckboxInput
                        legend=""
                        value={currentData.email_optin}
                        onChange={handleCheckboxChange('email_optin')}
                        hasError={false}
                        label={{'en': 'Contact via email', 'ta': 'மின்னஞ்சல் மூலம் தொடர்பு'}}
                    />
                </div>

                {/* Phone Contact */}
                <div className={`
                    ${styles.spans4Columns} 
                `}>
                    <CheckboxInput
                        legend=""
                        value={currentData.calls_optin}
                        onChange={handleCheckboxChange('calls_optin')}
                        hasError={false}
                        label={{'en': 'Contact via phone call', 'ta': 'தொலைபேசி மூலம் தொடர்பு'}}
                    />
                </div>

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Address for Communication */}
                <div className={`
                    ${styles.startsAtColumn5}
                    ${styles.spans4Columns} 
                `}>
                    <SelectInput
                        legend={{'en': 'Address for Communication', 'ta': 'தொடர்புக்கான முகவரி'}[language]}
                        value={addr_for_comm}
                        onChange={handleAddressChange}
                        hasError={false}
                        inputRange={addressTypes}
                    />
                </div>

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Participation Interests */}
                <div className={`${styles.checkboxGroup} ${styles.spansFullWidth}`}>
                    <label 
                        className={`
                            ${styles.checkboxTitle} 
                            ${language === "ta" 
                                ? styles.fontTamil 
                                : styles.fontEnglish
                            } 
                        `}
                    >
                        {{'en': 'Usual Participation', 'ta': 'வழக்கமாக பங்கேற்கும் நிகழ்வுகள்'}[language]}
                    </label>
                    <div className={styles.checkboxContainer}>
                        {participationEvents.map(
                            (option: {en: string; ta: string}, index: number) => (
                                <CheckboxInput
                                    key={index}
                                    legend=""
                                    value={currentData.programs.includes(index)}
                                    onChange={handleParticipationInterestsChange(index)}
                                    hasError={false}
                                    label={option}
                                />
                            )
                        )}
                    </div>
                </div>

                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`}/>

                {/* Previous Button */}
                <button
                    type="button"
                    className={`
                        ${styles.prevButton} 
                        ${language === "ta" 
                            ? styles.fontTamil 
                            : styles.fontEnglish
                        }
                    `}   
                    onClick={handlePrev}
                >
                    {`← ${{'en': 'Previous', 'ta': 'முந்தையது'}[language]}`}
                </button>

                {/* Next Button - Submits */}
                <button
                    type="submit"
                    className={`
                        ${styles.nextButton} 
                        ${isSubmitting ? styles.buttonDisabled : ''} 
                        ${language === "ta" 
                            ? styles.fontTamil 
                            : styles.fontEnglish
                        }
                    `}   
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
