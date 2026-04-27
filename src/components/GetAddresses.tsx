import { useState, useContext, useEffect } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import InputBox from '@blocks/InputBox';
import SelectInput from '@blocks/SelectInput';
import CheckboxInput from '@blocks/CheckboxInput';

import { LanguageContext } from '@utils/languageContext';
import { ShishyaDataContext } from '@utils/useShishyaData';
import { useConfirm } from '@utils/useConfirm';
import { FormState } from '@typedef/FormState';
import { GetPostOfficeData } from '@utils/getPostofficeData';

import type { FormErrors } from '@typedef/FormErrors';
import type { AddressDataType, NewFormProps } from '@typedef/ShishyaData';
import type { IndiaPostOffice } from '@typedef/PostOfficeData';

import { emptyAddressData, emptyCurrentAddressData } from '@constants/emptyShishyaData';
import { countryOptions } from '@constants/optionConstants';

import styles from '@styles/addShishyaCompStyles.module.css';

type AddressEditableField =
    | 'country_name'
    | 'postal_code'
    | 'state_name'
    | 'district_name'
    | 'city_name'
    | 'street_name'
    | 'area_name'
    | 'door_no';


export default function GetAddresses({
    setParentState, displayErrors
}: NewFormProps) {
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [postOffices, setPostOffices] = useState<IndiaPostOffice[]>([]);
    const confirm = useConfirm();

    const shishyaContext = useContext(ShishyaDataContext);
    const language: 'en' | 'ta' = useContext(LanguageContext)?.language || 'ta';

    const { data, updateData } = shishyaContext || { data: null, updateData: () => {} };
    const currentData = data?.addresses || [];

    const currentAddress: AddressDataType | undefined = currentData.find(
        (address) => address.current_address === true
    );
    const paddr_idx: number = currentData.findIndex(
        (address) => address.current_address === false
    );
    const permanentIsCurrent = paddr_idx !== -1
        && currentData[paddr_idx]?.current_is_permanent;
    const addressLocked: boolean = currentData[0]?.address_id !== '';

    useEffect(() => {
        let cancelled = false;
        if (currentAddress?.country_name === 'India' && currentAddress.postal_code) {
            GetPostOfficeData(currentAddress.postal_code).then((apiData) => {
                if (!cancelled) {
                    if (apiData && apiData.total > 0) {
                        setPostOffices(apiData.records);
                    } else {
                        setPostOffices([]);
                    }
                }
            });
        } else {
            Promise.resolve().then(() => {
                if (!cancelled) {
                    setPostOffices([]);
                }
            });
        }

        return () => {
            cancelled = true;
        };
    }, [currentAddress?.country_name, currentAddress?.postal_code]);

    if (!shishyaContext) {
        return null;
    }

    const fetchIndiaPostDetails = async (
        address: AddressDataType,
        postal_code: string,
        index: number
    ): Promise<AddressDataType> => {
        if (!postal_code || postal_code.length !== 6) {
            setPostOffices([]);
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`postal_code_${index}`]: {
                    en: 'Postal code is incorrect.',
                    ta: 'பின் கோட் தவறானது.',
                }[language],
            }));
            displayErrors({
                ...errors,
                [`postal_code_${index}`]: {
                    en: 'Postal code is incorrect.',
                    ta: 'பின் கோட் தவறானது.',
                }[language],
            });
            return { ...address, postal_code };
        }

        const newAddress: AddressDataType = { ...address, postal_code };
        try {
            const apiData = await GetPostOfficeData(postal_code);
            if (apiData && apiData.total > 0) {
                const postOfficeData = apiData.records;
                if (postOfficeData.length > 0) {
                    setPostOffices(postOfficeData);
                    Object.assign(newAddress, {
                        state_name: postOfficeData[0].statename,
                        district_name: postOfficeData[0].district,
                        area_name: postOfficeData[0].officename,
                        city_name: '',
                        street_name: '',
                        door_no: '',
                    });
                }
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [`postal_code_${index}`]: {
                        en: 'Postal code not found.',
                        ta: 'பின் கோட் கிடைக்கவில்லை.',
                    }[language],
                }));
                displayErrors({
                    ...errors,
                    [`postal_code_${index}`]: {
                        en: 'Postal code not found.',
                        ta: 'பின் கோட் கிடைக்கவில்லை.',
                    }[language],
                });
                setPostOffices([]);
                Object.assign(newAddress, {
                    state_name: '',
                    district_name: '',
                    area_name: '',
                    city_name: '',
                    street_name: '',
                    door_no: '',
                });
            }
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [`postal_code_${index}`]: {
                    en: 'Postal code not found.',
                    ta: 'பின் கோட் கிடைக்கவில்லை.',
                }[language],
            }));
            displayErrors({
                ...errors,
                [`postal_code_${index}`]: {
                    en: 'Postal code not found.',
                    ta: 'பின் கோட் கிடைக்கவில்லை.',
                }[language],
            });
            console.error('Error fetching post office data:', error);
        }
        return newAddress;
    };

    const resetControllingStates = () => {
        setErrors({});
        setIsSubmitting(false);
    };

    const copyCurrentToPermanent = (checked: boolean) => {
        setErrors({});
        displayErrors({});

        if (paddr_idx === -1) {
            return;
        }

        const newAddresses: AddressDataType[] = currentData.map((addr) => ({ ...addr }));
        if (checked && currentAddress) {
            newAddresses[paddr_idx] = {
                ...currentAddress,
                current_address: false,
                current_is_permanent: true,
            };
        } else {
            newAddresses[paddr_idx] = {
                ...emptyAddressData,
                current_address: false,
                current_is_permanent: false,
            };
        }
        updateData({ addresses: newAddresses });
    };

    const validateForm = () => {
        const allErrors: FormErrors = {};
        setErrors({});
        displayErrors({});

        currentData.forEach((address, index) => {
            if (!address.country_name.trim()) {
                allErrors[`country_name_${index}`] = {
                    en: 'Country is required!',
                    ta: 'நாடு குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (!address.postal_code.trim()) {
                allErrors[`postal_code_${index}`] = {
                    en: 'Postal code is required!',
                    ta: 'பின் கோடு குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (!address.state_name.trim()) {
                allErrors[`state_name_${index}`] = {
                    en: 'State is required!',
                    ta: 'மாநிலம் குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (!address.city_name.trim()) {
                allErrors[`city_name_${index}`] = {
                    en: 'City is required!',
                    ta: 'நகரம் குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (!address.street_name.trim()) {
                allErrors[`street_name_${index}`] = {
                    en: 'Street name is required!',
                    ta: 'தெரு குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (!address.door_no.trim()) {
                allErrors[`door_no_${index}`] = {
                    en: 'Door number is required!',
                    ta: 'வீட்டு எண் குறிப்பிடப்பட வேண்டும்!',
                }[language];
            }
            if (address.door_no && address.door_no.length > 50) {
                allErrors[`door_no_${index}`] = {
                    en: 'Door number should not exceed 50 characters!',
                    ta: 'வீட்டு எண் 50 எழுத்துகளை விட அதிகமாக இருக்கக்கூடாது!',
                }[language];
            }
        });
        setErrors(allErrors);
        displayErrors(allErrors);
        return Object.keys(allErrors).length === 0;
    };

    const handleAddressChange = async (
        index: number,
        field: AddressEditableField,
        value: string
    ) => {
        setErrors({});
        displayErrors({});

        const newAddresses: AddressDataType[] = currentData.map((addr) => ({ ...addr }));

        if (field === 'country_name') {
            newAddresses[index] = {
                ...emptyAddressData,
                current_address: newAddresses[index].current_address,
                country_name: value,
            };
        } else if (field === 'postal_code') {
            let postal_code = value;
            if (newAddresses[index].country_name === 'India') {
                postal_code = postal_code.replace(/\D/g, '');
                const newAddress: AddressDataType = await fetchIndiaPostDetails(
                    newAddresses[index],
                    postal_code,
                    index
                );
                newAddresses[index] = { ...newAddress };
            } else {
                newAddresses[index] = {
                    ...newAddresses[index],
                    postal_code,
                };
            }
        } else {
            newAddresses[index] = {
                ...newAddresses[index],
                [field]: value,
            };
        }

        if (permanentIsCurrent && paddr_idx !== -1 && index !== paddr_idx) {
            newAddresses[paddr_idx] = {
                ...newAddresses[index],
                current_address: false,
                current_is_permanent: true,
            };
        }

        updateData({ addresses: newAddresses });
    };

    const handleUnlockAddress = async () => {
        const result = await confirm({
            title: {
                en: 'Unlock Address',
                ta: 'முகவரியை திறக்கவும்',
            }[language],
            description: {
                en: 'Others registered with this address will not be affected. This change will happen only for you. Are you sure you want to change the address?',
                ta: 'உங்களைத் தவிர, இந்த முகவரியில் பதியப்பட்டிருக்கும் வேறொருவருக்கும் முகவரி மாறாது - உங்களுடைய முகவரி மட்டுமே மாறும். முகவரியை மாற்ற விரும்புகிறீர்களா? ',
            }[language],
            confirmBtnTitle: {
                en: 'Yes',
                ta: 'ஆம்',
            }[language],
            rejectBtnTitle: {
                en: 'No',
                ta: 'இல்லை',
            }[language],
        });

        if (result === true) {
            const newAddresses: AddressDataType[] = currentData.map((addr) => ({ ...addr }));
            newAddresses[0] = {
                ...emptyCurrentAddressData,
            };
            newAddresses[1] = {
                ...emptyAddressData,
                current_address: false,
                current_is_permanent: false,
            };
            updateData({ addresses: newAddresses });
        }
    };

    const handlePrev = async () => {
        const response: boolean = await confirm({
            title: {
                en: 'Confirm Action',
                ta: 'செயலை உறுதிப்படுத்தவும்',
            }[language],
            description: {
                en: 'Going back will discard all changes. Do you want to proceed?',
                ta: 'முந்தைய பக்கம் சென்றால் இதுவரை செய்த மாற்றங்கள் நீங்கிவிடும். பரவாயில்லையா?',
            }[language],
            confirmBtnTitle: {
                en: 'Yes',
                ta: 'ஆம்',
            }[language],
            rejectBtnTitle: {
                en: 'No',
                ta: 'இல்லை',
            }[language],
        });
        if (response === true) {
            resetControllingStates();
            setParentState(FormState.GET_IDENTITY);
        }
    };

    const handleNext = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        resetControllingStates();
        setIsSubmitting(true);

        if (!validateForm()) {
            setIsSubmitting(false);
            return;
        }

        setParentState(FormState.GET_BASICS);
        setIsSubmitting(false);
        resetControllingStates();
    };

    return (
        <form className={styles.form} onSubmit={handleNext} noValidate>
            {addressLocked && (
                <div className={styles.lockBox}>
                    <p className="text-secondary-light text-small">
                        {{
                            en: 'To change the addresses, click this→',
                            ta: 'முகவரிகளை மாற்ற இதனை அழுத்தவும் →',
                        }[language]}
                    </p>
                    <button
                        type="button"
                        onClick={handleUnlockAddress}
                        title="unlock addresses for editing"
                        className={styles.lockButton}
                    >
                        <FontAwesomeIcon icon={faLock} className={styles.lockIcon} />
                    </button>
                </div>
            )}

            {currentData.map((address, index) => {
                const addressDisabled = addressLocked
                    || (index === paddr_idx && permanentIsCurrent);
                const autoFilledFromPin = address.country_name === 'India';
                const countryIndex = countryOptions.findIndex(
                    (countryName) => countryName === address.country_name
                );
                const areaOptions = postOffices.map((office) => office.officename);
                const areaIndex = areaOptions.findIndex(
                    (officeName) => officeName === address.area_name
                );

                return (
                    <div key={address.current_address ? 'current' : 'permanent'}>
                        <h2 className={`
                            ${styles.sectionTitle} 
                            ${language === 'en' 
                                ? styles.fontEnglish 
                                : styles.fontTamil
                            }
                        `}>
                            {address.current_address
                                ? { en: 'Current Address', ta: 'தற்போதைய முகவரி' }[language]
                                : { en: 'Permanent Address', ta: 'நிலையான முகவரி' }[language]}
                        </h2>

                        {!address.current_address && (
                            <div className={styles.checkboxContainer}>
                                <CheckboxInput
                                    legend=""
                                    value={address.current_is_permanent}
                                    onChange={(checked) => {
                                        copyCurrentToPermanent(checked);
                                    }}
                                    hasError={false}
                                    label={{
                                        en: 'Same as Current Address',
                                        ta: 'தற்போதைய முகவரியே',
                                    }}
                                    disabled={addressLocked}
                                />
                            </div>
                        )}

                        <div className={styles.gridLayout}>
                            <div className={styles.spans4Columns}>
                                <SelectInput
                                    legend={{ en: 'Country', ta: 'நாடு' }[language]}
                                    value={countryIndex}
                                    onChange={(selectedIndex) => {
                                        const selectedCountry = selectedIndex >= 0
                                            ? countryOptions[selectedIndex] || ''
                                            : '';
                                        void handleAddressChange(index, 'country_name', selectedCountry);
                                    }}
                                    hasError={!!errors[`country_name_${index}`]}
                                    inputRange={countryOptions}
                                    required={true}
                                    disabled={addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'Pin Code', ta: 'பின் கோடு' }[language]}
                                    value={address.postal_code}
                                    onChange={(postalCode) => {
                                        void handleAddressChange(index, 'postal_code', postalCode);
                                    }}
                                    hasError={!!errors[`postal_code_${index}`]}
                                    required={true}
                                    disabled={addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'State', ta: 'மாநிலம்' }[language]}
                                    value={address.state_name}
                                    onChange={(stateName) => {
                                        void handleAddressChange(index, 'state_name', stateName);
                                    }}
                                    hasError={!!errors[`state_name_${index}`]}
                                    required={true}
                                    disabled={autoFilledFromPin || addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'District', ta: 'மாவட்டம்' }[language]}
                                    value={address.district_name}
                                    onChange={(districtName) => {
                                        void handleAddressChange(index, 'district_name', districtName);
                                    }}
                                    hasError={!!errors[`district_name_${index}`]}
                                    disabled={autoFilledFromPin || addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'City', ta: 'நகரம்' }[language]}
                                    value={address.city_name}
                                    onChange={(cityName) => {
                                        void handleAddressChange(index, 'city_name', cityName);
                                    }}
                                    hasError={!!errors[`city_name_${index}`]}
                                    required={true}
                                    disabled={addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'Street', ta: 'தெரு' }[language]}
                                    value={address.street_name}
                                    onChange={(streetName) => {
                                        void handleAddressChange(index, 'street_name', streetName);
                                    }}
                                    hasError={!!errors[`street_name_${index}`]}
                                    required={true}
                                    disabled={addressDisabled}
                                />
                            </div>

                            <div className={styles.spans4Columns}>
                                <InputBox
                                    legend={{ en: 'Door No', ta: 'வீட்டு எண்' }[language]}
                                    value={address.door_no}
                                    onChange={(doorNo) => {
                                        void handleAddressChange(index, 'door_no', doorNo);
                                    }}
                                    hasError={!!errors[`door_no_${index}`]}
                                    required={true}
                                    disabled={addressDisabled}
                                />
                            </div>

                            {address.country_name === 'India' && postOffices.length > 0 && (
                                <div className={styles.spans4Columns}>
                                    <SelectInput
                                        legend={{ en: 'Area', ta: 'பகுதி' }[language]}
                                        value={areaIndex}
                                        onChange={(selectedIndex) => {
                                            const areaName = selectedIndex >= 0
                                                ? areaOptions[selectedIndex] || ''
                                                : '';
                                            void handleAddressChange(index, 'area_name', areaName);
                                        }}
                                        hasError={!!errors[`area_name_${index}`]}
                                        inputRange={areaOptions}
                                        disabled={addressDisabled || postOffices.length === 0}
                                    />
                                </div>
                            )}

                            {address.country_name !== 'India' && (
                                <div className={styles.spans4Columns}>
                                    <InputBox
                                        legend={{ en: 'Area', ta: 'பகுதி' }[language]}
                                        value={address.area_name}
                                        onChange={(areaName) => {
                                            void handleAddressChange(index, 'area_name', areaName);
                                        }}
                                        hasError={!!errors[`area_name_${index}`]}
                                        disabled={addressDisabled}
                                    />
                                </div>
                            )}
                        </div>

                        <hr className={styles.separator} />
                    </div>
                );
            })}

            <div className={styles.gridLayout}>
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
