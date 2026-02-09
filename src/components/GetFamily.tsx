import { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faTrashCan, faLock } from '@fortawesome/free-solid-svg-icons';

import { LanguageContext } from '@utils/languageContext';
import { FormState } from '@typedef/FormState';
import type { FormErrors } from 'src/typedef/FormErrors';
import type { 
    FamilyMemberDataType, 
    FormProps 
} from '@typedef/ShishyaData';

import country from '@constants/country_prefix.json';

import styles from '@styles/GetFamily.module.css';


export default function GetFamily(
    { setParentState, currentData, updateParent, displayErrors }: FormProps<FamilyMemberDataType[]>
){
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);    
    const language: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';

    const font_style: string = language === "ta" ? "font-tamil" : "font-english";

    const [newMember, setNewMember] = useState<FamilyMemberDataType>({
        member_name: '',
        phone_number: '',
        country_code: '+91',
        same_address: false,
        no_edit: false,
    });

    const countryCodeOptions = country.list.map(({ callingCode, name }) => ({
        label: `(${callingCode}) ${name} `,
        value: callingCode
    }));
    
    const fineprint = {
        'ta': '(இந்த படிவத்தில், தங்கள் குடும்பத்தில், தற்போது திருமாளிகை சிஷ்யர்களாக இருக்கும், அல்லது எதிர்காலத்தில் சிஷ்யர்களாகக் கூடியவ்ர்கள் பற்றிய விவரங்களை நிரப்பவும். ஒரே குடும்பத்தில் உள்ளவர்களை அறியவே இந்தத் தகவல் சேகரிக்கப்படுகிறது. வேறு எந்த நோக்கத்திற்கும் அல்ல.)',
        'en': '(Please enter all members of your family who are Thirumaligai Shishyas already or likely to be in the future. This information is being collected to correlate records of family members and not for any other purpose.)'
    };

        {/* -----------------
        Helper Functions 
        ----------------- */}
    // Reset controlling states
    const resetControllingStates = () => {
        setErrors({});
        setIsSubmitting(false);
    }

    // Validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (newMember.member_name.trim() === '') {
            newErrors.member_name = {
                "en": "Name is required!",
                "ta": "பெயர் குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        if (newMember.phone_number.trim() === '') {
            newErrors['phone_number'] = {
                "en": "Phone number is required!",
                "ta": "தொலைபேசி எண் குறிப்பிடப்பட வேண்டும்!"
            }[language];
        }
        // Check if the new number is unique and not the same as any existing member
        const isDuplicate = currentData.some(
            member => 
                member.country_code === newMember.country_code && 
                member.phone_number === newMember.phone_number
        );
        if (isDuplicate) {
            newErrors['phone_number'] = {
                "en": "Phone number must be unique!",
                "ta": "இருவருக்கு ஒரே தொலைபேசி எண் இருக்கக்கூடாது!"
            }[language];
        }
        setErrors(newErrors);
        displayErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    {/* Handle Events */}
    // Handle Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setErrors({});
        displayErrors({});
        const {name, value} = e.target;
        setNewMember({ 
            ...newMember, 
            [name]: value 
        });
    }

    // Handle Add Family Member
    const handleAddMember = () => {
        if (!validateForm()) {
            return;
        }
        const updatedMembers = [...currentData, newMember];
        updateParent(updatedMembers);
        setNewMember({
            member_name: '',
            phone_number: '',
            country_code: '+91',
            same_address: false,
            no_edit: false,
        });
        setErrors({});
        displayErrors({});
    };
    // Handle Delete Family Member
    const handleDeleteMember = (index: number) => () => {
        const updatedMembers = [...currentData];
        updatedMembers.splice(index, 1);
        updateParent(updatedMembers);
        setErrors({});
        displayErrors({});
    };

    // Handle Previous Button Click
    const handlePrev = () => {
        setErrors({});
        displayErrors({});
        setParentState(FormState.GET_BASICS);
    };

    // Handle Next Button Click
    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});
        displayErrors({});
        updateParent(currentData);
        setParentState(FormState.GET_PREFERENCES);
        setIsSubmitting(false);
        resetControllingStates();
    }

    return(
        <form className={styles.form} onSubmit={handleNext} noValidate>
            <p className={styles.fineprint + " " + font_style}>{fineprint[language]}</p>
            <div className={styles.hiddenOnMobile}>
                {/* Headings */}
                <div className={styles.gridLayout}>
                    <h3 className={`${styles.tableHeading} ${font_style}`}>
                        { {'en': 'S.No.', 'ta': 'வரிசை எண்'}[language] }
                    </h3>                
                    <h3 className={`${styles.tableHeading} ${font_style} ${styles.spans4Columns}`}>                    
                        { {'en': 'Name', 'ta': 'பெயர்'}[language] }
                    </h3>
                    <h3 className={`${styles.tableHeading} ${font_style} ${styles.spans4Columns}`}>
                        { {'en': 'Phone Number', 'ta': 'தொலைபேசி'}[language] }
                    </h3>
                    <h3 className={`${styles.tableHeading} ${font_style} ${styles.spans2Columns}`}>
                        { {'en': 'Same as my address', 'ta': 'என் முகவரியே'}[language] }
                    </h3>
                    <h3 className={`${styles.tableHeading} ${font_style}`}>
                        { {'en': 'Action', 'ta': 'செயல்'}[language] }
                    </h3>
                </div>
            {/* Existing Members Rows */}
                {currentData.map((member, index) => (
                    <div key={`MemberRow-${index}`} className={styles.gridLayout}>
                        <div key={`No-${index}`} className={`${styles.tableCell} h-12`}>
                            {index + 1}
                        </div>
                        <div key={`Name-${index}`} className={`${styles.tableCell}  ${styles.spans4Columns}`}>
                            {member.member_name}
                        </div>
                        <div key={`Phone-${index}`} className={`${styles.tableCell}  ${styles.spans4Columns}`}>
                            {member.country_code} {member.phone_number}
                        </div>
                        <div key={`SameAddress-${index}`} className={`${styles.tableCell}  ${styles.spans2Columns}`}>
                            { member.same_address 
                                ? {'en': 'Yes', 'ta': 'ஆம்'}[language] 
                                : {'en': 'No', 'ta': 'இல்லை'}[language] 
                            }
                        </div>
                        <div key={`Action-${index}`} className={styles.tableCell}>
                            {(member.no_edit !== true) 
                                ? (
                                    <button
                                        type="button"
                                        className={styles.actionButton}
                                        onClick={handleDeleteMember(index)}
                                        title={{'en': 'Delete', 'ta': 'நீக்கு'}[language]}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>)
                                : (
                                    <button
                                        type="button"
                                        className={styles.actionButton}
                                        title={{'en': 'Cannot delete member', 'ta': 'உறுப்பினரை நீக்க முடியாது'}[language]}
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faLock} />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}
                <div className={styles.gridLayout}>
                    {/* New Member Input Row */}
                    <div className={`${styles.tableCell}`}>
                        {currentData.length + 1}
                    </div>
                    <div className={`${styles.tableCell} ${styles.spans4Columns}`}>
                        <input
                            name="member_name"
                            type="text"
                            className={`
                                ${styles.inputField} ${styles.noBorder} 
                                ${errors.member_name ? styles.inputError : ''}
                                text-center
                            `}
                            placeholder={{'en': 'Enter name', 'ta': 'பெயரை உள்ளிடுக'}[language]}
                            value={newMember.member_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={`${styles.tableCell} ${styles.spans4Columns}`}>
                        <div className={`${styles.phoneGroup} ${styles.noBorder}  ${errors.phone_number ? styles.inputError : ''}`}>
                            <select
                                name="country_code"
                                data-length={newMember.country_code.length}
                                value={newMember.country_code}
                                onChange={handleChange}
                                className={styles.countryCodeSelect}
                                title={{'en': 'Country Code', 'ta': 'ஐ.எஸ். கோட்'}[language]}
                            >
                                {countryCodeOptions.map((option) => (
                                    <option key={option.label} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="phone_number"
                                type="tel"
                                value={newMember.phone_number}
                                onChange={handleChange}
                                placeholder={{'en': 'Phone Number', 'ta': 'தொலைபேசி எண்'}[language]}
                                className={styles.phoneInput}
                            />
                        </div>
                    </div>
                    <div className={`${styles.tableCell} ${styles.spans2Columns}`}>
                        <label className={`${styles.checkboxLabel} ${font_style}`}>
                            <input
                                type="checkbox"
                                name="same_address"
                                checked={newMember.same_address}
                                onChange={(e) => setNewMember({ ...newMember, same_address: e.target.checked })}
                                className={styles.checkboxInput}
                            />
                            {''}
                        </label>
                    </div>
                    <div className={styles.tableCell}>
                        <button
                            type="button"
                            className={styles.actionButton}
                            onClick={handleAddMember}
                            title={{'en': 'Add Member', 'ta': 'உறுப்பினரைச் சேர்க்கவும்'}[language]}
                        >
                            <FontAwesomeIcon icon={faUserPlus} />
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.visibleOnMobile}>
                {/* Existing Members Cards */}
                {currentData.map((member, index) => (
                    <div key={index} className={styles.memberCard}>
                        <div className={styles.cardRow}>
                            <span className={`${styles.cardLabel} ${font_style}`}>
                                {{'en': 'S.No.', 'ta': 'வரிசை எண்'}[language]}
                            </span>
                            <span className={`${styles.cardValue} ${font_style}`}>
                                {index + 1}
                            </span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={`${styles.cardLabel} ${font_style}`}>
                                {{'en': 'Name', 'ta': 'பெயர்'}[language]}
                            </span>
                            <span className={`${styles.cardValue} ${font_style}`}>
                                {member.member_name}
                            </span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={`${styles.cardLabel} ${font_style}`}>
                                {{'en': 'Phone Number', 'ta': 'தொலைபேசி'}[language]}
                            </span>
                            <span className={`${styles.cardValue} ${font_style}`}>
                                {member.country_code} {member.phone_number}
                            </span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={`${styles.cardLabel} ${font_style}`}>
                                {{'en': 'In my address', 'ta': 'என் முகவரியே'}[language]}
                            </span>
                            <span className={`${styles.cardValue} ${font_style}`}>
                                {member.same_address 
                                    ? {'en': 'Yes', 'ta': 'ஆம்'}[language] 
                                    : {'en': 'No', 'ta': 'இல்லை'}[language]
                                }
                            </span>
                        </div>
                        <div className={styles.cardRow}>
                            <span className={`${styles.cardLabel} ${font_style}`}>
                                {{'en': 'Action', 'ta': 'செயல்'}[language]}
                            </span>
                            {(index !== 0) 
                                ? (
                                    <button
                                        type="button"
                                        className={styles.actionButton}
                                        onClick={handleDeleteMember(index)}
                                        title={{'en': 'Delete', 'ta': 'நீக்கு'}[language]}
                                    >
                                        <FontAwesomeIcon icon={faTrashCan} />
                                    </button>)
                                : (
                                    <button
                                        type="button"
                                        className={styles.actionButton}
                                        title={{'en': 'Cannot delete primary member', 'ta': 'முதன்மை உறுப்பினரை நீக்க முடியாது'}[language]}
                                        disabled
                                    >
                                        <FontAwesomeIcon icon={faLock} />
                                    </button>
                                )
                            }
                        </div>
                    </div>
                ))}

                {/* New Member Input Card */}
                <div className={styles.memberCard}>
                    <div className={styles.cardRow}>
                        <span className={`${styles.cardLabel} ${font_style}`}>
                            {{'en': 'S.No.', 'ta': 'வரிசை எண்'}[language]}
                        </span>
                        <span className={`${styles.cardValue} ${font_style}`}>
                            {currentData.length + 1}
                        </span>
                    </div>
                    <div className={styles.cardRow}>
                        <span className={`${styles.cardLabel} ${font_style}`}>
                            {{'en': 'Name', 'ta': 'பெயர்'}[language]}
                        </span>
                        <input
                            name="member_name"
                            type="text"
                            className={`${styles.inputField} ${font_style}  ${errors.member_name ? styles.inputError : ''}`}
                            placeholder={{'en': 'Enter name', 'ta': 'பெயரை உள்ளிடுக'}[language]}
                            value={newMember.member_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className={styles.cardRow}>
                        <span className={`${styles.cardLabel} ${font_style}`}>
                            {{'en': 'Phone Number', 'ta': 'தொலைபேசி'}[language]}
                        </span>
                        <div className={`${styles.phoneGroup} ${errors.phone_number ? styles.inputError : ''}`}>
                            <select
                                name="country_code"
                                data-length={newMember.country_code.length}
                                value={newMember.country_code}
                                onChange={handleChange}
                                className={styles.countryCodeSelect}
                                title={{'en': 'Country Code', 'ta': 'ஐ.எஸ்.டி கோட்'}[language]}
                            >
                                {countryCodeOptions.map((option) => (
                                    <option key={option.label} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            <input
                                name="phone_number"
                                type="tel"
                                value={newMember.phone_number}
                                onChange={handleChange}
                                placeholder={{'en': 'Phone Number', 'ta': 'தொலைபேசி எண்'}[language]}
                                className={styles.phoneInput}
                            />
                        </div>
                    </div>
                    <div className={styles.cardRow}>
                        <span className={`${styles.cardLabel} ${font_style}`}>
                            {{'en': 'In my address', 'ta': 'என் முகவரியே'}[language]}
                        </span>
                        <label className={`${styles.checkboxLabel} ${font_style}`}>
                            <input
                                type="checkbox"
                                name="same_address"
                                checked={newMember.same_address}
                                onChange={(e) => setNewMember({ ...newMember, same_address: e.target.checked })}
                                className={styles.checkboxInput}
                            />
                            {''}
                        </label>
                    </div>
                    <div className={styles.cardRow}>
                        <span className={`${styles.cardLabel} ${font_style}`}>
                            {{'en': 'Action', 'ta': 'செயல்'}[language]}
                        </span>
                        <button
                            type="button"
                            className={styles.actionButton}
                            onClick={handleAddMember}
                            title={{'en': 'Add Member', 'ta': 'உறுப்பினரைச் சேர்க்கவும்'}[language]}
                        >
                            <FontAwesomeIcon icon={faUserPlus} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className={styles.gridLayout}>
                <button
                    type="button"
                    className={styles.prevButton}
                    onClick={handlePrev}
                    disabled={isSubmitting}
                >
                    {{'en': '← Previous', 'ta': '← முந்தைய'}[language]}
                </button>
                <button
                    type="submit"
                    className={styles.nextButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting 
                        ? {'en': 'Please wait...', 'ta': 'காத்திருக்கவும்...'}[language]
                        : {'en': 'Next →', 'ta': 'அடுத்து →'}[language]
                    }
                </button>
            </div>
        </form>
    );   
}