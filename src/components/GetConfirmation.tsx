import { useContext } from 'react';
import { LanguageContext } from '@utils/languageContext';
import { useConfirm } from '@utils/useConfirm';
import { FormState } from '@typedef/FormState';
import type { 
    ShishyaDataType,
    FormProps,
} from '@typedef/ShishyaData';
import type { JsonDataType } from '@typedef/JsonData';

import genders from '@constants/genders.json';
import panchasamskaram from '@constants/panchasamskaram.json';
import marriage from '@constants/marriage.json';
import professions from '@constants/professions.json';
import birthstars from '@constants/birthstars.json';
import tamil_months from '@constants/tamil_months.json';
import interests from '@constants/interests.json';
import addressitem from '@constants/addresses.json';
import participation from '@constants/participation.json';

import styles from '@styles/GetConfirmation.module.css';


export default function GetConfirmation(
    {setParentState, currentData, updateParent}: FormProps<ShishyaDataType>
) {
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';
    const font_style: string = language === "ta" ? "font-tamil" : "font-english";
    const confirm = useConfirm();
        
    
    {/* Helper Functions */}
    // Helper function to get label by index
    const getLabel = (jsonData: JsonDataType, index: number | boolean, key: string = 'name') => {
        if (typeof index === 'boolean') {
            index = index ? 0 : 1;
        }
        if (index === -1 || index === undefined) return null;
        const items = jsonData[key];
        if (items && items[index]) {
            return items[index][language] || null;
        }
        return null;
    };

    // Helper function to get interests
    const getInterests = () => {
        if (!currentData.details.interests || currentData.details.interests.length === 0) {
            return null;
        }
        const interestsList = currentData.details.interests
            .map(index => getLabel(interests, index, 'list'))
            .filter(item => item !== null);
        return interestsList.length > 0 ? interestsList.join(', ') : null;
    };

    // Helper function to get participation interests
    const getParticipationInterests = () => {
        if (!currentData.preferences.programs || currentData.preferences.programs.length === 0) {
            return null;
        }
        const participationList = currentData.preferences.programs
            .map(index => getLabel(participation, index, 'list'))
            .filter(item => item !== null);
        return participationList.length > 0 ? participationList.join(', ') : null;
    };

    // Helper to check if value should be displayed
    const hasValue = (value: string | number | null | undefined) => {
        if (value === null || value === undefined || value === -1 || value === '') {
            return false;
        }
        return true;
    };

    // Helper function to format address as comma-separated string
    const formatAddress = (address: ShishyaDataType['addresses'][0]) => {
        const addressParts = [
            address.door_no,
            address.street_name,
            address.area_name,
            address.city_name,
            address.district_name,
            address.state_name,
            address.country_name,
            address.postal_code
        ].filter(part => hasValue(part));
        
        return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
    };

    {/* Event Handlers */}
    const handleConfirmation = async (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault();
        // Check using ConfirmModal if user really wants to submit
        const result = await confirm({
            title: {
                'en': 'Confirm Submission', 
                'ta': 'சமர்ப்பிப்பை உறுதிப்படுத்தவும்'
            }[language],
            description: {
                'en': 'Are you sure you want to submit the Shishya information?', 
                'ta': 'ஷிஷ்யா தகவலை சமர்ப்பிக்க விரும்புகிறீர்களா?'
            }[language],
        });
        
        if (result) {
            // On confirmation, submit data
            setParentState(FormState.GET_COMPLETION);
            updateParent(currentData);
        }
    }

    return (
    <div className={styles.form}>
        <h2 className={`${styles.sectionTitle} ${font_style}`}>
            {{'en': 'Review and Submit', 'ta': 'சரிபார்த்து சமர்ப்பிக்கவும்'}[language]}
        </h2>
        
        <div className={styles.section}>
            {/* Identity Information */}
            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <tbody>
                        <tr className={styles.tableRow}>
                            <td className={`${styles.firstColumn} ${font_style}`}>
                                {{'en': 'Name', 'ta': 'பெயர்'}[language]}
                            </td>
                            <td className={styles.dataColumn}>{currentData.identity.shishya_name}</td>
                        </tr>
                        <tr className={styles.tableRow}>
                            <td className={`${styles.firstColumn} ${font_style}`}>
                                {{'en': 'Phone Number', 'ta': 'தொலைபேசி எண்'}[language]}
                            </td>
                            <td className={styles.dataColumn}>{currentData.identity.country_code}{currentData.identity.phone_number}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Basic Information */}
            <div className={styles.tableContainer}>
                <h3 className={`${styles.tableTitle} ${font_style}`}>
                    {{'en': 'Basic Information', 'ta': 'அடிப்படை தகவல்'}[language]}
                </h3>
                <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                        {currentData.details.date_of_birth && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} w-1/3 ${font_style}`}>
                                    {{'en': 'Date of Birth', 'ta': 'பிறந்த தேதி'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{currentData.details.date_of_birth.toDateString()}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.gender) && getLabel(genders, currentData.details.gender) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Gender', 'ta': 'பாலினம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(genders, currentData.details.gender)}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.email) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Email', 'ta': 'மின்னஞ்சல்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{currentData.details.email}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.gotram) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Gothram', 'ta': 'கோத்ரம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{currentData.details.gotram}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.tamil_month) && getLabel(tamil_months, currentData.details.tamil_month) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Tamil Month', 'ta': 'தமிழ் மாதம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(tamil_months, currentData.details.tamil_month)}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.birthstar) && getLabel(birthstars, currentData.details.birthstar) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Birth Star', 'ta': 'நட்சத்திரம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(birthstars, currentData.details.birthstar)}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.marital_status) && getLabel(marriage, currentData.details.marital_status, 'status') && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Marital Status', 'ta': 'திருமண நிலை'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(marriage, currentData.details.marital_status, 'status')}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.panchasamskaram) && getLabel(panchasamskaram, currentData.details.panchasamskaram, 'options') && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Panchasamskaram', 'ta': 'பஞ்ச சம்ஸ்காரம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(panchasamskaram, currentData.details.panchasamskaram, 'options')}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.profession) && getLabel(professions, currentData.details.profession) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Profession', 'ta': 'தொழில்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getLabel(professions, currentData.details.profession)}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.job_details) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Job Details', 'ta': 'வேலை விவரங்கள்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{currentData.details.job_details}</td>
                            </tr>
                        )}
                        {hasValue(currentData.details.poorvikam) && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Poorvikam', 'ta': 'பூர்விகம்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{currentData.details.poorvikam}</td>
                            </tr>
                        )}
                        {getInterests() && (
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Interests', 'ta': 'ஆர்வங்கள்'}[language]}
                                </td>
                                <td className={styles.dataColumn}>{getInterests()}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Addresses */}
            {currentData.addresses && currentData.addresses.length > 0 && (
                <div className={styles.tableContainer}>
                    <h3 className={`${styles.tableTitle} ${font_style}`}>
                        {{'en': 'Addresses', 'ta': 'முகவரிகள்'}[language]}
                    </h3>
                    <table className={styles.table}>
                        <tbody>
                            {currentData.addresses.map((address, index) => {
                                const formattedAddress = formatAddress(address);
                                if (formattedAddress === 'N/A') return null;
                                return (
                                    <tr key={index} className={styles.tableRow}>
                                        <td className={`${styles.firstColumn} w-1/3 ${font_style}`}>
                                            {address.current_address 
                                                ? {'en': 'Current Address', 'ta': 'தற்போதைய முகவரி'}[language]
                                                : {'en': 'Permanent Address', 'ta': 'நிரந்தர முகவரி'}[language]
                                            }
                                        </td>
                                        <td className={styles.dataColumn}>{formattedAddress}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Family Members */}
            {currentData.family_members && currentData.family_members.length > 0 && (
                <div className={styles.tableContainer}>
                    <h3 className={`${styles.tableTitle} ${font_style}`}>
                        {{'en': 'Family Members', 'ta': 'குடும்ப உறுப்பினர்கள்'}[language]}
                    </h3>
                    <table className={styles.table}>
                        <thead>
                            <tr className="bg-gray-100">
                                <th className={`${styles.tableHeader} ${font_style}`}>
                                    {{'en': 'Name', 'ta': 'பெயர்'}[language]}
                                </th>
                                <th className={`${styles.tableHeader} ${font_style}`}>
                                    {{'en': 'Phone Number', 'ta': 'தொலைபேசி எண்'}[language]}
                                </th>
                                <th className={`${styles.tableHeader} ${font_style}`}>
                                    {{'en': 'Same Address', 'ta': 'அதே முகவரி'}[language]}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.family_members.map((member, index) => (
                                <tr key={index} className={styles.tableRow}>
                                    <td className={`${styles.dataColumn} ${font_style}`}>{member.member_name}</td>
                                    <td className={`${styles.dataColumn} ${font_style}`}>
                                        {member.country_code}{member.phone_number}
                                    </td>
                                    <td className={`${styles.dataColumn} ${font_style}`}>
                                        {member.same_address 
                                            ? {'en': 'Yes', 'ta': 'ஆம்'}[language]
                                            : {'en': 'No', 'ta': 'இல்லை'}[language]
                                        }
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Communication Preferences */}
            {currentData.preferences && (
                <div className={styles.tableContainer}>
                    <h3 className={`${styles.tableTitle} ${font_style}`}>
                        {{'en': 'Communication', 'ta': 'தொலைதொடர்பு'}[language]}
                    </h3>
                    <table className={styles.table}>
                        <tbody>
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} w-1/3 ${font_style}`}>
                                    {{'en': 'WhatsApp Group', 'ta': 'வாட்ஸ்அப் குழு'}[language]}
                                </td>
                                <td className={`${styles.dataColumn} ${font_style}`}>
                                    {currentData.preferences.wagroup_optin 
                                        ? {'en': 'Yes', 'ta': 'ஆம்'}[language]
                                        : {'en': 'No', 'ta': 'இல்லை'}[language]
                                    }
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'WhatsApp One-to-One', 'ta': 'வாட்ஸ்அப் தனிப்பட்ட'}[language]}
                                </td>
                                <td className={`${styles.dataColumn} ${font_style}`}>
                                    {currentData.preferences.whatsapp_optin 
                                        ? {'en': 'Yes', 'ta': 'ஆம்'}[language]
                                        : {'en': 'No', 'ta': 'இல்லை'}[language]
                                    }
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Email Contact', 'ta': 'மின்னஞ்சல் தொடர்பு'}[language]}
                                </td>
                                <td className={`${styles.dataColumn} ${font_style}`}>
                                    {currentData.preferences.email_optin 
                                        ? {'en': 'Yes', 'ta': 'ஆம்'}[language]
                                        : {'en': 'No', 'ta': 'இல்லை'}[language]
                                    }
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Phone Contact', 'ta': 'தொலைபேசி தொடர்பு'}[language]}
                                </td>
                                <td className={`${styles.dataColumn} ${font_style}`}>
                                    {currentData.preferences.calls_optin 
                                        ? {'en': 'Yes', 'ta': 'ஆம்'}[language]
                                        : {'en': 'No', 'ta': 'இல்லை'}[language]
                                    }
                                </td>
                            </tr>
                            <tr className={styles.tableRow}>
                                <td className={`${styles.firstColumn} ${font_style}`}>
                                    {{'en': 'Communication Address', 'ta': 'தொடர்பு முகவரி'}[language]}
                                </td>
                                <td className={`${styles.dataColumn} ${font_style}`}>
                                    {getLabel(addressitem,currentData.preferences.contact_current_address,'type') || 'N/A'}
                                </td>
                            </tr>
                            {getParticipationInterests() && (
                                <tr className={styles.tableRow}>
                                    <td className={`${styles.firstColumn} ${font_style}`}>
                                        {{'en': 'Usual Participation', 'ta': 'வழக்கமாக பங்கேற்கும் நிகழ்ச்சிகள்'}[language]}
                                    </td>
                                    <td className={`${styles.dataColumn} ${font_style}`}>{getParticipationInterests()}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* Action Buttons */}
        <div className={styles.buttonContainer}>
            <button
                type="button"
                className={`${styles.prevBtn} ${font_style}`}
                onClick={() => setParentState(FormState.GET_PREFERENCES)}
            >
                {{'en': 'Review', 'ta': 'மதிப்பாய்வு'}[language]}
            </button>
            <button
                type="button"
                className={`${styles.nextBtn} ${font_style}`}
                onClick={handleConfirmation}
            >
                {{'en': 'Submit', 'ta': 'சமர்ப்பிக்கவும்'}[language]}
            </button>
        </div>
    </div>
    );
}
