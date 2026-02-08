import { useState, /* useEffect, */ useContext } from 'react';

import { LanguageContext } from '@utils/languageContext';
import { invokeApi } from '@utils/api';
import { FormState } from '@typedef/FormState';

import type { FormErrors } from 'src/typedef/FormErrors';
import type { 
    IdentityDataType, 
    BasicDataType, 
    AddressDataType, 
    FamilyMemberDataType, 
    PreferencesType ,
    ShishyaDataType,
    ShishyaDataResultType
} from '@typedef/ShishyaData';

import { 
    emptyIdentityData, 
    emptyBasicData, 
    emptyAddressData, 
    emptyCurrentAddressData, 
    emptyFamilyMemberData ,
    emptyPreferencesData
} from '@constants/emptyShishyaData';

import GetIdentity from '@components/GetIdentity';
import GetAddresses from '@components/GetAddresses';
import GetBasicData from '@components/GetBasicData';
import GetFamily from '@components/GetFamily';
import GetPreferences from '@components/GetPreferences';
import GetConfirmation from '@components/GetConfirmation';
import ShowCompletion from '@components/ShowCompletion';

import titles from '@constants/title.json';

import styles from '@styles/AddShishya.module.css'



export default function AddShishya() {
    const [errors, setErrors] = useState<FormErrors>({});
    const [formState, setFormState] = useState<FormState>(FormState.GET_IDENTITY);
    const [data, setData] = useState<ShishyaDataType>({
        identity: emptyIdentityData,
        details: emptyBasicData,
        addresses: [emptyCurrentAddressData, emptyAddressData],
        family_members: [emptyFamilyMemberData],
        preferences: emptyPreferencesData
    });
    const [resultMessage, setResultMessage] = useState<ShishyaDataResultType>({
        count: 0,
        message: "",
        current_address_id: "",
        permanent_address_id: "",
        family_id: ""
    });

    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const state: number = formState as number;
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
    const handleStateChange = async (newState: FormState) => {
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
                    setData(prevData => ({
                        ...prevData,
                        identity: fetchedData.identity || prevData.identity,
                        details: fetchedData.details || prevData.details,
                        addresses: fetchedData.addresses?.length > 0 
                            ? fetchedData.addresses 
                            : prevData.addresses,
                        family_members: fetchedData.family_members?.length > 0 
                            ? fetchedData.family_members 
                            : prevData.family_members,
                        preferences: fetchedData.preferences || prevData.preferences
                    }));
                }
            } else if (response.error) {
                console.error('Error fetching Shishya data:', response.error);
                setErrors({ general: response.error.message });
                return; // Stay in the same state
            }
        }
        if (formState === FormState.GET_ADDRESS && newState === FormState.GET_IDENTITY) {
            // Clear Data back to empty
            setData(prevData => ({
                ...prevData,
                identity: emptyIdentityData,
                details: emptyBasicData,
                addresses: [emptyCurrentAddressData, emptyAddressData],
                family_members: [emptyFamilyMemberData],
                preferences: emptyPreferencesData
            }));
        }
        setFormState(newState);
        setErrors({});
    };

    // To be done independent of state transitions
    const updateIdentityData = (newData: IdentityDataType) => {
        setData(prevData => ({
            ...prevData,
            identity: newData
        }));
    }

    const updateAddressData = (updatedData: AddressDataType[]) => {
        // Check if the address ID got changed to "" (indicating a new address)
        // If yes, set all the same_address indicators in family details to false
        const currentAddressId = data.addresses[0].address_id;
        const newAddressId = updatedData[0].address_id;
        if (currentAddressId !== "" && newAddressId === "") {
            data.family_members.map((member, index) => {
                if (index !== 0) { // Skip the first member as it is the shishya themselves
                    member.same_address = false;
                    setData(prevData => ({
                        ...prevData,
                        family_members: data.family_members
                    }));
                }
            })
        }
        setData(prevData => ({
            ...prevData,
            addresses: updatedData
        }));
    }

    const updateBasicData = (updatedData: BasicDataType) => {
        setData(prevData => ({
            ...prevData,
            details: updatedData
        }));
    }

    const updateFamilyMembers = (updatedData: FamilyMemberDataType[]) => {
        setData(prevData => ({
            ...prevData,
            family_members: updatedData
        }));
    }

    const updatePreferences = (updatedData: PreferencesType) => {
        setData(prevData => ({
            ...prevData,
            preferences: updatedData
        }));
    }

    const postDataToDb = async () => {
        const response = await invokeApi('shishya','POST', {
            body: data
        });
        if (!response.success) {
            const errorMsg = response.error ? response.error.message : 'Unknown error occurred';
            setErrors({ general: errorMsg });
            setFormState(FormState.GET_CONFIRMATION); // Stay in the same state
            return;
        }
        // On success, reset the data to empty and go to GET_IDENTITY state
        // Perhaps: Show Success Message for 2 seconds?
        setResultMessage(response.data as unknown as ShishyaDataResultType);
    }

    const resetForm = () => {
        setData({
            identity: emptyIdentityData,
            details: emptyBasicData,
            addresses: [emptyCurrentAddressData, emptyAddressData],
            family_members: [emptyFamilyMemberData],
            preferences: emptyPreferencesData
        });
        setFormState(FormState.GET_IDENTITY);
        setErrors({});
    }

    return(
        <div className={styles.masterContainer}>
             <div className={styles.innerBox}>
                <h1 className={`${styles.stateTitle} ${font_style}`}>
                    {titles.name[state][language]}
                </h1>

                {(formState === FormState.GET_IDENTITY) &&
                    <GetIdentity 
                        setParentState={handleStateChange}
                        currentData={data.identity}
                        updateParent={updateIdentityData}
                        displayErrors={setErrors}
                    />
                }

                {(formState === FormState.GET_ADDRESS) &&
                    <GetAddresses 
                        setParentState={handleStateChange}
                        currentData={data.addresses}
                        updateParent={updateAddressData}
                        displayErrors={setErrors}
                    />
                }

                {(formState === FormState.GET_BASICS) &&
                    <GetBasicData 
                        setParentState={handleStateChange}
                        currentData={data.details}
                        updateParent={updateBasicData}
                        displayErrors={setErrors}
                    />
                }

                {(formState === FormState.GET_FAMILY) &&
                    <GetFamily 
                        setParentState={handleStateChange}
                        currentData={data.family_members}
                        updateParent={updateFamilyMembers}
                        displayErrors={setErrors}
                    />
                }

                {(formState === FormState.GET_PREFERENCES) &&
                    <GetPreferences 
                        setParentState={handleStateChange}
                        currentData={data.preferences}
                        updateParent={updatePreferences}
                        displayErrors={setErrors}
                    />
                }

                {(formState === FormState.GET_CONFIRMATION) &&
                <GetConfirmation 
                    setParentState={handleStateChange}
                    currentData={data}
                    updateParent={postDataToDb}
                    displayErrors={setErrors}
                />
                }

                {(formState === FormState.GET_COMPLETION) &&
                <ShowCompletion 
                    setParentState={resetForm}
                    currentData={resultMessage}
                    updateParent={() => {}}
                    displayErrors={() => {}}
                />
                }

                {
                Object.keys(errors).length > 0 && 
                <span className={`${styles.error} ${font_style}`}>
                    {Object.values(errors)[0]}
                </span>
            }
             </div>
        </div>
    );
}