import { useState, useContext, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { LanguageContext } from '@utils/languageContext';
import { useConfirm } from '@utils/useConfirm';
import { FormState } from '@typedef/FormState';
import { GetPostOfficeData } from '@utils/getPostofficeData';

import type { FormErrors } from '@typedef/FormErrors';
import type { FormProps, AddressDataType } from '@typedef/ShishyaData';
import type { IndiaPostOffice } from '@typedef/PostOfficeData';

import { emptyAddressData, emptyCurrentAddressData } from '@constants/emptyShishyaData';

import country from '@constants/country_prefix.json';

import styles from '@styles/GetAddresses.module.css';


export default function GetAddresses(
    { setParentState, currentData, updateParent, displayErrors } : FormProps<AddressDataType[]>
) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [postOffices, setPostOffices] = useState<IndiaPostOffice[]>([]);
    const confirm = useConfirm();

    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";
    const width4_limit: string ="md:max-w-50 md:ml-auto";
    const width6_limit: string ="md:max-w-90 md:ml-auto";

    const countryOptions: (string | undefined)[] = country.list.map(({ name }) => name);

    const currentAddress: AddressDataType | undefined = currentData.find(address => address.current_address === true);
    const paddr_idx: number = currentData.findIndex(address => address.current_address === false);
    const addressLocked: boolean = currentData[0].address_id !== '';

    // Initialize postOffices when component mounts or currentData changes
    useEffect(() => {
        let cancelled = false;   
        if (currentAddress?.country_name === "India" && currentAddress.postal_code) {
            GetPostOfficeData(currentAddress.postal_code).then((data) => {
                if (!cancelled) {
                    if (data && data.total > 0) {
                        setPostOffices(data.records);
                    } else {
                        setPostOffices([]);
                    }
                }
            });
        } else {
            // Clear postOffices asynchronously to avoid cascading renders
            Promise.resolve().then(() => {
                if (!cancelled) {
                    setPostOffices([]);
                }
            });
        }
        
        return () => { cancelled = true; };
    }, [currentAddress?.country_name, currentAddress?.postal_code]);


    {/* Helpers */}
    // Fetch India Post Details
    const fetchIndiaPostDetails = async (
        address: AddressDataType, 
        postal_code: string, 
        index: number
    ): Promise<AddressDataType> => {
        if (!postal_code || postal_code.length !== 6) {
            setPostOffices([]);
            setErrors(prevErrors => ({
                ...prevErrors,
                [`postal_code_${index}`]: {
                    "en": "Postal code is incorrect.",
                    "ta": "பின் கோட் தவறானது."
                }[language]
            }));
            displayErrors({
                ...errors,
                [`postal_code_${index}`]: {
                    "en": "Postal code is incorrect.",
                    "ta": "பின் கோட் தவறானது."
                }[language]
            });
            return { ...address, postal_code };
        }

        const newAddress: AddressDataType = { ...address, postal_code };
        try {
            const data = await GetPostOfficeData(postal_code);
            if (data && data.total > 0) {
                const postOfficeData = data.records;
                if (postOfficeData.length > 0) {
                    setPostOffices(postOfficeData);
                    Object.assign(newAddress, {
                        state_name: postOfficeData[0].statename,
                        district_name: postOfficeData[0].district,
                        area_name: postOfficeData[0].officename,
                        city_name: '', // City name is not provided by API
                        street_name: '',
                        door_no: ''
                    });
                }
            } else {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`postal_code_${index}`]: {
                        "en": "Postal code not found.",
                        "ta": "பின் கோட் கிடைக்கவில்லை."
                    }[language]
                }));
                displayErrors({
                    ...errors,
                    [`postal_code_${index}`]: {
                        "en": "Postal code not found.",
                        "ta": "பின் கோட் கிடைக்கவில்லை."
                    }[language]
                });
                setPostOffices([]);
                Object.assign(newAddress, {
                    state_name: '',
                    district_name: '',
                    area_name: '',
                    city_name: '',
                    street_name: '',
                    door_no: ''
                });
            }
        } catch (error) {
                setErrors(prevErrors => ({
                    ...prevErrors,
                    [`postal_code_${index}`]: {
                        "en": "Postal code not found.",
                        "ta": "பின் கோட் கிடைக்கவில்லை."
                    }[language]
                }));
                displayErrors({
                    ...errors,
                    [`postal_code_${index}`]: {
                        "en": "Postal code not found.",
                        "ta": "பின் கோட் கிடைக்கவில்லை."
                    }[language]
                });
            console.error('Error fetching post office data:', error);
        }
        return(newAddress);
    }

    // Reset controlling states
    const resetControllingStates = () => {
        setErrors({});
        setIsSubmitting(false);
    }

    // Copy Current Address to Permanent Address
    const copyCurrentToPermanent = (
        e: React.ChangeEvent<HTMLInputElement>, 
    ) => {
        setErrors({});
        displayErrors({});
        const checked = e.target.checked;
        const newAddresses: AddressDataType[] = currentData.map(addr => ({ ...addr }));
        if (checked && paddr_idx !== -1 && currentAddress) {
            // Copy current address to permanent address
            newAddresses[paddr_idx] = {
                ...currentAddress!,
                current_address: false,
                current_is_permanent: true
            };
        } else {
            // Reset permanent address to empty
            newAddresses[paddr_idx] = {
                ...emptyAddressData,
                current_address: false,
                current_is_permanent: false
            };
        }
        updateParent(newAddresses);
    };

    // Form Validation
    const validateForm = () => {
        const allErrors: FormErrors = {};
        setErrors({});  
        displayErrors({});
        // Add validation logic here
        currentData.forEach((address, index) => {
            if (!address.country_name.trim()) {
                allErrors[`country_name_${index}`] = {
                    "en": "Country is required!",
                    "ta": "நாடு குறிப்பிடப்பட வேண்டும்!"
                }[language];
            }
            if (!address.postal_code.trim()) {
                allErrors[`postal_code_${index}`] = {
                "en": "Postal code is required!",
                "ta": "பின் கோடு குறிப்பிடப்பட வேண்டும்!"
            }[language];
            }
            if (!address.state_name.trim()) {
                allErrors[`state_name_${index}`] = {
                    "en": "State is required!",
                    "ta": "மாநிலம் குறிப்பிடப்பட வேண்டும்!"
                }[language];
            }
            if (!address.city_name.trim()) {
                allErrors[`city_name_${index}`] = {
                    "en": "City is required!",
                    "ta": "நகரம் குறிப்பிடப்பட வேண்டும்!"
                }[language];
            }
            if (!address.street_name.trim()) {
                allErrors[`street_name_${index}`] = {
                    "en": "Street name is required!",
                    "ta": "தெரு குறிப்பிடப்பட வேண்டும்!"
                }[language];
            }
            if (!address.door_no.trim()) {
                allErrors[`door_no_${index}`] = {
                    "en": "Door number is required!",
                    "ta": "வீட்டு எண் குறிப்பிடப்பட வேண்டும்!"
                }[language];
            }
        });
        setErrors(allErrors);
        displayErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    }

    {/* Event Handlers */}
    // Handle Address Change for "same as current address" checkbox
    const handleAddressChange = async (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        index: number,
        field: keyof AddressDataType
    ) => {
        setErrors({});
        displayErrors({});
        
        const newAddresses: AddressDataType[] = currentData.map(addr => ({ ...addr }));
                
        if (field === "country_name") { // If country_code is changed
            // Whenever country is changed, clear postal code and other fields

            newAddresses[index] = { 
                ...emptyAddressData, 
                current_address: newAddresses[index].current_address, 
                country_name: e.target.value 
            };
        } else if (field === "postal_code") { // If postal_code is changed
            let postal_code = e.target.value;
            if (newAddresses[index].country_name === "India") {
                // For India, allow only digits in postal code
                postal_code = postal_code.replace(/\D/g, '');
                const newAddress: AddressDataType = await fetchIndiaPostDetails(
                    newAddresses[index], 
                    postal_code, 
                    index
                );
                newAddresses[index] = { ...newAddress };
            } else { // If postal_code is not for India
                newAddresses[index] = { 
                    ...newAddresses[index], 
                    [field]: e.target.value 
                };
            }
        } else { // All other fields
            newAddresses[index] = { 
                ...newAddresses[index], 
                [field]: e.target.value 
            };
        }

        // When current is permanent, changes in current should reflect in permanent too
        if (currentData[paddr_idx].current_is_permanent 
            && index !== paddr_idx
        ) {
            newAddresses[paddr_idx] = { 
                ...newAddresses[index], 
                current_address: false, 
                current_is_permanent: true 
            };
        }
        
        updateParent(newAddresses);
    };

    // Handle Unlock Address
    const handleUnlockAddress = async  () => {
        const result = await confirm({
            title: {
                "en": "Unlock Address",
                "ta": "முகவரியை திறக்கவும்"
            }[language],
            description: {
                "en": "Others registered with this address will not be affected. This change will happen only for you. Are you sure you want to change the address?",
                "ta": "உங்களைத் தவிர, இந்த முகவரியில் பதியப்பட்டிருக்கும் வேறொருவருக்கும் முகவரி மாறாது - உங்களுடைய முகவரி மட்டுமே மாறும். முகவரியை மாற்ற விரும்புகிறீர்களா? "
            }[language],
            confirmBtnTitle: {
                "en": "Yes",
                "ta": "ஆம்"
            }[language],
            rejectBtnTitle: {
                "en": "No",
                "ta": "இல்லை"
            }[language]
        });
        if (result === true) {
            const newAddresses: AddressDataType[] = currentData.map(addr => ({ ...addr }));
            newAddresses[0] = {
                ...emptyCurrentAddressData,
            };
            newAddresses[1] = {
                ...emptyAddressData,
                current_address: false,
                current_is_permanent: false
            };
            updateParent(newAddresses);
        } else {
            // User cancelled the unlock action, do nothing
        }
    }

    // Handle Back Button
    const handlePrev = async () => {
        const response: boolean  = await confirm({
            title: {
                "en": "Confirm Action",
                "ta": "செயலை உறுதிப்படுத்தவும்"
            }[language],
            description: {
                "en": "Going back will discard all changes. Do you want to proceed?",
                "ta": "முந்தைய பக்கம் சென்றால் இதுவரை செய்த மாற்றங்கள் நீங்கிவிடும். பரவாயில்லையா?"
            }[language],
            confirmBtnTitle: {
                "en": "Yes",
                "ta": "ஆம்"
            }[language],
            rejectBtnTitle: {
                "en": "No",
                "ta": "இல்லை"
            }[language]
        });
        if (response === true) {
            resetControllingStates();

            setParentState(FormState.GET_IDENTITY);
        } else  {
            // Handle cancellation if needed
        }
    };

    // Handle Form Submission
    const handleNext = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetControllingStates();
        setIsSubmitting(true);
        if (!validateForm()){
            setIsSubmitting(false);
            return;
        }
        setParentState(FormState.GET_BASICS);
        setIsSubmitting(false);
        resetControllingStates();   
    };

    return(
        <form className={styles.formContainer} onSubmit={handleNext} noValidate>

            {/* Address Lock Opening */}
            {addressLocked  && (
                <div className={styles.lockBox}>
                    <p className='text-secondary-light text-small'>
                        {{
                            "en": "To change the addresses, click this→", 
                            "ta": "முகவரிகளை மாற்ற இதனை அழுத்தவும் →"
                        }[language]}
                    </p>
                    <button 
                        type="button" 
                        onClick={handleUnlockAddress} 
                        title="unlock addresses for editing"
                        className={styles.lockButton}
                    >
                        <FontAwesomeIcon icon={faLock} className={styles.lockIcon}/>
                    </button>

                </div>
            )}
            {/* Display the addresses - current first and then the permanent */}
            {currentData.map((address, index) => (
                <div key={`${address.current_address ? "current" : "permanent"}`}>
                    <h2 className={`${styles.sectionTitle} ${font_style}`}>
                        {address.current_address 
                        ? {"en": "Current Address", "ta": "தற்போதைய முகவரி"}[language]
                        : {"en": "Permanent Address", "ta": "நிலையான முகவரி"}[language]}
                    </h2>

                    {/* Current is Permanent Checkbox */}
                    {!address.current_address && (
                        <div className={styles.labelGroup}>
                            <input
                                type="checkbox"
                                id={`current_is_permanent_${index}`}
                                name="current_is_permanent"
                                checked={address.current_is_permanent}
                                onChange={copyCurrentToPermanent}
                                className={styles.checkboxField}
                                disabled={addressLocked}
                                aria-label={{'en': 'Same as Current Address', 'ta': 'தற்போதைய முகவரியே'}[language]}
                            />
                            <label
                               htmlFor={`current_is_permanent_${index}`}
                                className={`${styles.formLabel} ${font_style} ${styles.ml05}`}
                            >
                                {{'en': 'Same as Current Address', 'ta': 'தற்போதைய முகவரியே'}[language]}
                            </label>
                        </div>
                    )}

                    <div className={styles.gridLayout}>
                        {/* Country Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label
                                className={`${styles.formLabel} ${font_style}`}
                                htmlFor={`country_name_${index}`}
                            >
                                {{'en': 'Country', 'ta': 'நாடு'}[language]}
                            </label>
                            <select
                                className={`
                                    ${styles.selectField} 
                                    ${styles.spans4Columns} 
                                    ${font_style} ${width4_limit} 
                                    ${errors[`country_name_${index}`] ? styles.inputError : ''}
                                    ${address.country_name === '' ? styles.placeholderText : ''}
                                `}
                                id={`country_name_${index}`}
                                name={`country_name_${index}`}
                                value={address.country_name}
                                autoComplete='country-name'
                                onChange={(e) => handleAddressChange(e, index, 'country_name')}
                                disabled={index === paddr_idx && currentData[paddr_idx].current_is_permanent || addressLocked}
                            >
                                <option value="">
                                    {{'en': 'Select', 'ta': 'தேர்ந்தெடு'}[language]}
                                </option>
                                {countryOptions.map((countryName, idx) => (
                                    <option key={idx} value={countryName}>
                                        {countryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Postal Code Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label 
                                htmlFor={`postal_code_${index}`} 
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'Pin Code', 'ta': 'பின் கோடு'}[language]}
                            </label>
                            <input
                                type="text"
                                id={`postal_code_${index}`}
                                name={`postal_code_${index}`}
                                value={address.postal_code}
                                onChange={(e) => handleAddressChange(e, index, "postal_code")}
                                className={`
                                    ${styles.inputField} 
                                    ${width4_limit} 
                                    ${errors[`postal_code_${index}`] ? styles.inputError : ''}
                                `}
                                disabled={index === paddr_idx && currentData[paddr_idx].current_is_permanent || addressLocked}
                                autoComplete='postal-code'
                            />
                       </div>

                       {/* State Name Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label 
                                htmlFor={`state_name_${index}`}
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'State', 'ta': 'மாநிலம்'}[language]}
                            </label>
                            <input
                                type="text"
                                id={`state_name_${index}`}
                                name={`state_name_${index}`}
                                disabled={
                                    address.country_name === "India" 
                                    || (index === paddr_idx 
                                        && currentData[paddr_idx].current_is_permanent)
                                    || addressLocked
                                }
                                value={address.state_name}
                                onChange={(e) => handleAddressChange(e, index, "state_name")}
                                className={`
                                    ${styles.inputField} 
                                    ${width4_limit} 
                                    ${errors[`state_name_${index}`] ? styles.inputError : ''}
                                `}
                            />
                        </div>

                        {/* District Name Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label 
                                htmlFor={`district_name_${index}`} 
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'District', 'ta': 'மாவட்டம்'}[language]}
                            </label>
                            <input
                                type="text"
                                id={`district_name_${index}`}
                                name={`district_name_${index}`}
                                disabled={address.country_name === "India" 
                                    || (index === paddr_idx 
                                        && currentData[paddr_idx].current_is_permanent)
                                    || addressLocked
                                }
                                value={address.district_name}
                                onChange={(e) => handleAddressChange(e, index, "district_name")}
                                className={`
                                    ${styles.inputField} 
                                    ${width4_limit} 
                                    ${errors[`district_name_${index}`] ? styles.inputError : ''}
                                `}
                            />
                        </div>

                        {/* City Name Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label 
                                htmlFor={`city_name_${index}`}
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'City', 'ta': 'நகரம்'}[language]} 
                            </label>
                            <input
                                type="text"
                                id={`city_name_${index}`}
                                name={`city_name_${index}`}
                                value={address.city_name}
                                onChange={(e) => handleAddressChange(e, index, "city_name")}
                                className={`
                                    ${styles.inputField} 
                                    ${styles.width6_limit} 
                                    ${width4_limit}`}
                                disabled={index === paddr_idx 
                                    && currentData[paddr_idx].current_is_permanent
                                    || addressLocked
                                }
                            />
                        </div>

                        {/* Street Name Field */}
                        <div className={`${styles.formGroup} ${styles.spans4Columns}`}>
                            <label 
                                htmlFor={`street_name_${index}`} 
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'Street', 'ta': 'தெரு'}[language]}
                            </label>
                            <input
                                type="text"
                                id={`street_name_${index}`}
                                name={`street_name_${index}`}
                                value={address.street_name}
                                onChange={(e) => handleAddressChange(e, index, "street_name")}
                                className={`${styles.inputField} ${width4_limit}`}
                                disabled={index === paddr_idx 
                                    && currentData[paddr_idx].current_is_permanent
                                    || addressLocked
                                }
                            />
                        </div>

                        {/* Door No Field */}
                        <div className={`
                            ${styles.formGroup} 
                            ${styles.spans4Columns}
                        `}>
                            <label 
                                htmlFor={`door_no_${index}`}
                                className={`${styles.formLabel} ${font_style}`}
                            >
                                {{'en': 'Door No', 'ta': 'வீட்டு எண்'}[language]} 
                            </label>
                            <input
                                type="text"
                                id={`door_no_${index}`}
                                name={`door_no_${index}`}
                                value={address.door_no}
                                onChange={(e) => handleAddressChange(e, index, "door_no")}
                                className={`${styles.inputField} ${width4_limit}`}
                                disabled={index === paddr_idx 
                                    && currentData[paddr_idx].current_is_permanent
                                    || addressLocked
                                }
                            />
                        </div>

                        {/* Post Office Field */}
                        {address.country_name === "India" && postOffices.length > 0 && (
                            <div className={`
                                ${styles.formGroup} 
                                ${styles.spans6Columns} 
                                ${styles.startsAtColumn7}
                            `}>
                                <label 
                                    htmlFor={`area_name_${index}`} 
                                    className={styles.formLabel}
                                >
                                    {{'en': 'Area', 'ta': 'பகுதி'}[language]}
                                </label>
                                <select
                                    id={`area_name_${index}`}
                                    name={`area_name_${index}`}
                                    value={address.area_name || ''}
                                    onChange={(e) => handleAddressChange(e, index, "area_name")}
                                    className={`
                                        ${styles.selectField} 
                                        ${width6_limit} 
                                        ${!address.area_name ? styles.selectPlaceholder : ""}
                                        ${errors[`area_name_${index}`] ? styles.inputError : ''}
                                        ${address.area_name === '' ? styles.placeholderText : ''}
                                    `}
                                    disabled={index === paddr_idx 
                                        && currentData[paddr_idx].current_is_permanent 
                                        || postOffices.length === 0
                                        || addressLocked
                                    }
                                >
                                    <option value="">Select</option>
                                    {postOffices.map((office, idx) => (
                                        <option 
                                            key={idx} 
                                            value={office.officename}
                                            disabled={index === paddr_idx 
                                                && currentData[paddr_idx].current_is_permanent
                                                || postOffices.length === 0
                                                || addressLocked
                                            }
                                        >
                                            {office.officename}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            )}

                        {/* Area Name Field */}
                        {((address.country_name !== "India") &&
                            <div className={`${styles.formGroup} ${styles.spans6Columns} ${styles.startsAtColumn7}`}>
                            <label 
                                htmlFor={`area_name_${index}`} 
                                className={styles.formLabel}
                            >
                                {{'en': 'Area', 'ta': 'பகுதி'}[language]}
                            </label>
                            <input
                                type="text"
                                id={`area_name_${index}`}
                                name={`area_name_${index}`}
                                value={address.area_name}
                                onChange={(e) => handleAddressChange(e, index, "area_name")}
                                className={`
                                    ${styles.inputField} 
                                    ${width6_limit}
                                    ${errors[`area_name_${index}`] ? styles.inputError : ''}
                                `}
                                disabled={index === paddr_idx 
                                    && currentData[paddr_idx].current_is_permanent
                                    || addressLocked
                                }
                            />
                        </div>
                        )}

                    </div>
                    <hr className={styles.separator} />
                 </div>
            ))}
            {/* Navigation Buttons */}
            <div className={styles.gridLayout}>
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