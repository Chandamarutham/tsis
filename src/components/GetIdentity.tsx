import { useState, useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';
import type { 
    FormProps, 
    IdentityDataType,
} from '@typedef/ShishyaData';
import type { FormErrors } from '@typedef/FormErrors';
import { FormState } from '@typedef/FormState';
import country from '@constants/country_prefix.json';
import styles from '@styles/GetIdentity.module.css';

export default function GetIdentity({
    setParentState, currentData, updateParent, displayErrors
} : FormProps<IdentityDataType>) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";
    const width_limit: string ="max-w-85 ml-auto";
    const countryCodeOptions = country.list.map(({ callingCode, name }) => ({
        label: `(${callingCode}) ${name} `,
        value: callingCode
    }));
    const fullPhoneNumber = `${currentData.country_code}${currentData.phone_number.replace(/^\+\d+\s?/, '')}`;
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        updateParent({
            ...currentData,
            [name]: value
        });
        setErrors({});
        displayErrors({});
    }

    const handleNext = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        // Perform validation inline - not a big form, so keeping it simple
        const newErrors: FormErrors = {};
        if(!currentData.shishya_name.trim()) {
            newErrors.shishya_name = "Name is required"; // Replace with localized error
        }
        if(!currentData.phone_number.trim()) {
            newErrors.phone_number = "Phone number is required"; // Replace with localized error
        }
        if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(fullPhoneNumber)) {
            newErrors.phone_number = "Invalid phone number format"; // Replace with localized error
        }

        if(Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            displayErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        // If validation passes, update parent and move to next state
        updateParent(currentData);
        setParentState(FormState.GET_ADDRESS); // Assuming 1 is the next state
    };

    return(
        <form className={styles.form} noValidate onSubmit={handleNext}>
            <div className={styles.gridLayout}>
                {/* Name Field */}
                <div className={`${styles.formGroup} ${styles.spans6Columns}`}>
                    <label className={`${styles.formLabel} ${font_style}`} htmlFor='shishya_name'>
                        {{'en': 'Name', 'ta': 'பெயர்'}[   language]}:
                    </label>
                    <input className={`${styles.inputField} ${width_limit} ${errors.shishya_name ? styles.inputError : ''}`}
                        type="text"
                        id="shishya_name"
                        name="shishya_name"
                        value={currentData.shishya_name}
                        onChange={handleChange}
                        placeholder={
                            {
                                'en': 'Enter your full name', 
                                'ta': 'தங்கள் முழு பெயரை உள்ளிடவும்'
                            }[language]}
                    />
                </div>

                {/* Phone Group Field */}
                <div 
                    className={`${styles.formGroup} ${styles.spans6Columns}`}
                >
                    <label
                        className={`${styles.formLabel} ${font_style}`}
                        htmlFor='phone_number'
                    >
                        {{'en': 'Phone Number', 'ta': 'தொலைபேசி'}[language]}:
                    </label>
                    <div className={`${styles.phoneGroup} ${errors.phone_number ? styles.inputError : ''} ${"font-english"} ${width_limit}`}>
                    <select
                        data-length={currentData.country_code.length}
                        name="country_code"
                        value={currentData.country_code}
                        onChange={handleChange}
                        className={styles.countryCodeSelect}
                        aria-label={{'en': 'Country Code', 'ta': 'ஐ.எஸ்.டி கோடு'}[language]}
                    >
                        {countryCodeOptions.map((option) => (
                            <option 
                                key={option.label} 
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    <input  
                        className={styles.phoneInput}
                        type="tel"
                        id="phone_number"
                        name="phone_number"
                        value={currentData.phone_number}
                        onChange={handleChange}
                        placeholder={
                            {
                                'en': 'Phone number', 
                                'ta': 'தொலைபேசி எண்'
                            }[language]}
                    />
                    </div>
                </div>
                {/* Separator */}
                <hr className={`${styles.separator} ${styles.spansFullWidth}`} />

                {/* Next Button */}
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