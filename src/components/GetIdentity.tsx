import { useState, useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';
import { ShishyaDataContext } from '@utils/useShishyaData';
import type { FormErrors } from '@typedef/FormErrors';
import type { PhoneNumberValue } from '@typedef/BlockValue';
import type { NewFormProps } from '@typedef/ShishyaData';

import { FormState } from '@typedef/FormState';

import InputBox from '@blocks/InputBox';
import PhoneNumber from '@blocks/PhoneNumber';

import styles from '@styles/addShishyaCompStyles.module.css';


export default function GetIdentity({
    setParentState, displayErrors
}: NewFormProps) {
    const [nameErrors, setNameErrors] = useState<FormErrors>({});
    const [phoneErrors, setPhoneErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const shishyaContext = useContext(ShishyaDataContext);
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    if (!shishyaContext) {
        return null;
    }

    const { data, updateData } = shishyaContext;
    const currentData = data.identity;
    const e164Number = `${currentData.country_code}${currentData.phone_number.replace(/^\+\d+\s?/, '')}`;
    
    const handleNameChange = (new_name: string) => {
        updateData({
            identity: {
                ...currentData,
                shishya_name: new_name
            }
        });
        setNameErrors({});
        setPhoneErrors({});
        displayErrors({});
    }

    const handlePhoneNumberChange = (phNoVal: PhoneNumberValue) => {
        updateData({
            identity: {
                ...currentData,
                country_code: phNoVal.country_code,
                phone_number: phNoVal.phone_number
            }
        });
        setNameErrors({});
        setPhoneErrors({});
        displayErrors({});
    }

    const validate = (): FormErrors => {
        const newErrors: FormErrors = {};
        if(!currentData.shishya_name.trim()) {
            newErrors.shishya_name = "name_required";
            setNameErrors(newErrors);
        }
        if (currentData.phone_number.trim() === '') {
            newErrors.phone_number = "phone_required";
            setPhoneErrors(newErrors);
        } else if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(e164Number)) {
            newErrors.phone_number = "invalid_phone";
            setPhoneErrors(newErrors);
        }
        console.log("Validation Errors: ", newErrors);
        return newErrors;
    }

    const handleNext = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate before moving to next step
        const newErrors: FormErrors = validate();
        if(Object.keys(newErrors).length > 0) {
            setNameErrors(newErrors);
            setPhoneErrors(newErrors);
            displayErrors(newErrors);
            setIsSubmitting(false);
            return;
        }
        // If validation passes, update parent and move to next state
        updateData({ identity: currentData });
        setIsSubmitting(false);
        setNameErrors({});
        setPhoneErrors({});
        setParentState(FormState.GET_ADDRESS); // Assuming 1 is the next state
    };

    return(
        <form className={styles.form} noValidate onSubmit={handleNext}>
            <div className={styles.gridLayout}>
                {/* Name Field */}
                <InputBox
                    legend={
                        {
                            'en': 'Full Name',
                            'ta': 'முழு பெயர்'
                        }[language]
                    }
                    value={currentData.shishya_name}
                    onChange={handleNameChange}
                    hasError={!!nameErrors.shishya_name}
                    required={true}
                    placeholder={
                        {
                            'en': 'Enter your full name', 
                            'ta': 'தங்கள் முழு பெயரை உள்ளிடவும்'
                        }[language]}
                    className={styles.spans6Columns}
                />


                {/* Phone Group Field */}
                <PhoneNumber
                    legend={
                        {
                            'en': 'Phone Number',
                            'ta': 'தொலைபேசி எண்'
                        }[language]
                    }
                    value={{
                        country_code: currentData.country_code,
                        phone_number: currentData.phone_number,
                        e164_number: e164Number
                    }}
                    onChange={handlePhoneNumberChange}
                    hasError={!!phoneErrors.phone_number}
                    required={true}
                    className={styles.spans6Columns}
                />
                {/* Separator */}
                <hr className={`
                    ${styles.separator} 
                    ${styles.spansFullWidth}
                `} />

                {/* Next Button */}
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
                    ? (`${{'en': 'Wait...', 'ta': 'பொறுக்கவும்...'}[language]}`)
                    : (`${{'en': 'Next →', 'ta': 'அடுத்தது →'}[language]}`)
                    }
                </button>
            </div>
        </form>
    );
}
