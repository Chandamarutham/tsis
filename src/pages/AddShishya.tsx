import { useState, useReducer, useMemo, useCallback, useContext, useEffect } from 'react';

import { LanguageContext } from '@utils/languageContext';
import { invokeApi } from '@utils/api';
import { 
    ShishyaDataContext, 
    getStepIndex, 
    stepOrder,
    initialData,
    type ShishyaAction
} from '@utils/useShishyaData';
import { FormState } from '@typedef/FormState';

import type { FormErrors } from 'src/typedef/FormErrors';
import type {
    ShishyaDataType,
    ShishyaDataResultType
} from '@typedef/ShishyaData';

import { errorMessages, type ErrorKey } from '@constants/errorMessages';
import { titles } from '@constants/optionConstants';

import GetIdentity from '@components/GetIdentity';
import GetAddresses from '@components/GetAddresses';
import GetBasicData from '@components/GetBasicData';
import GetFamily from '@components/GetFamily';
import GetPreferences from '@components/GetPreferences';
import GetConfirmation from '@components/GetConfirmation';
import ShowCompletion from '@components/ShowCompletion';

import styles from '@styles/AddShishya.module.css'

const formStateReducer = (state: FormState, action: ShishyaAction): FormState => {
    switch (action.type) {
        case 'nextStep': {
            const currentIndex = getStepIndex(state);
            const nextIndex = Math.min(currentIndex + 1, stepOrder.length - 1);
            return stepOrder[nextIndex];
        }
        case 'prevStep': {
            const currentIndex = getStepIndex(state);
            const prevIndex = Math.max(currentIndex - 1, 0);
            return stepOrder[prevIndex];
        }
        case 'resetForm':
            return FormState.GET_IDENTITY;
        case 'updateData':
            // Data updates are handled by ShishyaDataContext, not form state
            return state;
        default:
            return state;
    }
};

export default function AddShishya() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [formState, dispatchFormState] = useReducer(formStateReducer, FormState.GET_IDENTITY);
    const [resultMessage, setResultMessage] = useState<ShishyaDataResultType>({
        count: 0,
        message: "",
        current_address_id: "",
        permanent_address_id: "",
        family_id: ""
    });

    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const shishyaContext = useContext(ShishyaDataContext);
    
    const data = shishyaContext?.data;
    const updateData = shishyaContext?.updateData;
    const stepIndex: number = formState as number;
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";

    /* --------------------------------
    UseEffect Section - for debug only
    --------------------------------- */
/*     useEffect(() => {
        console.log('Current Data:', data);
    }, [data]); */


    /* --------------------------------
    Handler Functions Section
    --------------------------------- */
    const handleErrors = useCallback((newErrors: FormErrors) => {
        setErrors(newErrors);
    }, []);

    const handleStateChange = useCallback(async (newState: FormState) => {
        if (!data || !updateData) return;
        
        // Handle transition specific backend logic here if needed
        if (formState === FormState.GET_IDENTITY && newState === FormState.GET_ADDRESS) {
            // Validate identity data with backend and fetch details as available
            const response = await invokeApi('shishya','GET', {
                    queryParams: {
                        shishya_name: data.identity.shishya_name,
                        phone_number: data.identity.phone_number,
                        country_code: data.identity.country_code
            }});
            if (response.success && response.data) {
                const fetchedData = response.data as unknown as ShishyaDataType;
                if (fetchedData !== null) {
                    // Populate data with fetched details
                    updateData({
                        identity: fetchedData.identity || data.identity,
                        details: fetchedData.details || data.details,
                        addresses: fetchedData.addresses?.length > 0 
                            ? fetchedData.addresses 
                            : data.addresses,
                        family_members: fetchedData.family_members?.length > 0 
                            ? fetchedData.family_members 
                            : data.family_members,
                        preferences: fetchedData.preferences || data.preferences
                    });
                }
            } else if (response.error) {
                setErrors({ general: response.error.message });
                dispatchFormState({ type: 'resetForm' });
                return; // Stay in the same state
            }
        }
        
        // Handle going back from GET_ADDRESS to GET_IDENTITY - reset everything
        if (formState === FormState.GET_ADDRESS && newState === FormState.GET_IDENTITY) {
            dispatchFormState({ type: 'resetForm' });
            updateData(initialData);
            setErrors({});
            return;
        }
        
        // Determine which action to dispatch based on state transition
        const currentIndex = getStepIndex(formState);
        const targetIndex = getStepIndex(newState);
        
        if (targetIndex === currentIndex) {
            return; // No change needed
        } else if (targetIndex === 0) {
            dispatchFormState({ type: 'resetForm' });
        } else if (targetIndex === currentIndex + 1) {
            dispatchFormState({ type: 'nextStep' });
        } else if (targetIndex === currentIndex - 1) {
            dispatchFormState({ type: 'prevStep' });
        }
        
        setErrors({});
    }, [formState, data, updateData]);

    const resetForm = useCallback(() => {
        dispatchFormState({ type: 'resetForm' });
        setErrors({});
    }, []);

    // Handle API POST when transitioning to completion state
    useEffect(() => {
        if (formState === FormState.GET_COMPLETION && data) {
            const performSubmit = async () => {
                const response = await invokeApi('shishya','POST', {
                    body: data
                });
                if (!response.success) {
                    const errorMsg = response.error ? response.error.message : 'Unknown error occurred';
                    setErrors({ general: errorMsg });
                    return;
                }
                setResultMessage(response.data as unknown as ShishyaDataResultType);
            };
            performSubmit();
        }
    }, [formState, data]);

    const stepTitle = useMemo(() => {
        return titles[stepIndex][language];
    }, [language, stepIndex]);

    const stepContent = useMemo(() => {
        if (!data) return null;
        switch (formState) {
            case FormState.GET_IDENTITY:
                return (
                    <GetIdentity 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_ADDRESS:
                return (
                    <GetAddresses 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_BASICS:
                return (
                    <GetBasicData 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_FAMILY:
                return (
                    <GetFamily 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_PREFERENCES:
                return (
                    <GetPreferences 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_CONFIRMATION:
                return (
                    <GetConfirmation 
                        setParentState={handleStateChange}
                        displayErrors={handleErrors}
                    />
                );
            case FormState.GET_COMPLETION:
                return (
                    <ShowCompletion 
                        setParentState={resetForm}
                        currentData={resultMessage}
                        updateParent={() => {}}
                        displayErrors={() => {}}
                    />
                );
            default:
                return null;
        }
    }, [
        data,
        formState,
        handleStateChange,
        handleErrors,
        resetForm,
        resultMessage
    ]);

    return(
        <div className={styles.masterContainer}>
            <div className={styles.innerBox}>
                <h1 className={`${styles.stateTitle} ${font_style}`}>
                    {stepTitle}
                </h1>

                {stepContent}

                    {
                    Object.keys(errors).length > 0 && 
                    <span className={`${styles.error} ${font_style}`}>
                        {(() => {
                            const firstError = Object.values(errors)[0];
                            if (!firstError) {
                                return '';
                            }
                            return errorMessages[firstError as ErrorKey]?.[language] || firstError;
                        })()}
                    </span>
                }
            </div>
        </div>
    );
}