import { 
    useMemo, 
    useState, 
    useContext 
} from 'react';

import type { FormErrors } from '@typedef/FormErrors';
import type { 
    BlockProps, 
    PhoneNumberValue 
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import country from '@constants/country_prefix.json';
import styles from '@styles/PhoneNumber.module.css';

export default function PhoneNumber({
    legend,
    onChange,
    onError,
    disabled = false,
    required = false,
    className = '',
}: BlockProps<PhoneNumberValue>) {
    const [countryCode, setCountryCode] = useState<string>(() => '+91');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [e164Number, setE164Number] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const lang: 'en' | 'ta'  = useContext(LanguageContext)?.language || 'ta';

    // Helper function to build the PhoneNumberValue object
    const buildValue = (nextCountryCode: string, nextPhone: string): PhoneNumberValue => {
        const trimmedCode = nextCountryCode.trim();
        const digitsOnly = nextPhone.replace(/[^0-9]/g, '');
        const e164Number = digitsOnly.length > 0 ? `${trimmedCode}${digitsOnly}` : '';
        return {
            country_code: trimmedCode,
            phone_number: nextPhone,
            e164_number: e164Number,
        };
    };

    // Helper function for getting the country code from the json file
    const countryOptions = useMemo(
        () => country.list.map(({ callingCode, name }) => ({
        label: `${callingCode} ${name}`,
        value: callingCode,
        })),
        []
    );

    // Helper function to validate the phone number and set errors if any
    const validate = () => {
        if (required && phoneNumber.trim() === '') {
            setErrors({ phoneNumber: "phone_required" });
            onError({ phoneNumber: "phone_required" });
            return false;
        }
        if (!/^\+(?:[0-9] ?){6,14}[0-9]$/.test(e164Number)) {
            setErrors({ phoneNumber: "invalid_phone" });
            onError({ phoneNumber: "invalid_phone" });
            return false;
        }
        setErrors({});
        onError({});
        return true;
    };

    // Helper function to emit the change event with the current value
    const emitChange = () => {
        const payload = buildValue(countryCode, phoneNumber);
        setE164Number(payload.e164_number);
        validate();
        onChange(payload);
    };

    // Event handler for country code change
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextCountryCode = event.target.value;
        setCountryCode(nextCountryCode);
        emitChange();
    };

    // Event handler for phone number change
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextPhone = event.target.value;
        setPhoneNumber(nextPhone);
        emitChange();
    };

  return (
    <fieldset 
        className={`
            ${styles.phn_fieldset} 
            ${className}
        `} 
        disabled={disabled}
    >
        <legend 
            className={`
                ${styles.phn_legend}
                ${lang === 'ta' ? styles.phn_tamilFont : styles.phn_englishFont}
            `}
        >
            {legend} {required && <span className={styles.phn_required}>*</span>}
        </legend>

      <div className={`
                ${styles.phn_group} 
                ${errors.phoneNumber ? styles.phn_error : ''}
            `}
        >
        <select
          aria-label="Country code"
          className={styles.phn_countrySelect}
          value={countryCode}
          onChange={handleCountryChange}
          data-code-length={
            Math.min(
                Math.max(countryCode.length, 2), 
                6
            )
        }
          disabled={disabled}
        >
          {countryOptions.map((option) => (
            <option key={option.label} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          aria-label="Phone number"
          className={styles.phn_phoneInput}
          type="tel"
          inputMode="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder= {
            {
                'en': 'Phone number', 
                'ta': 'தொலைபேசி எண்'
            }[lang]
        }
          disabled={disabled}
        />
      </div>
    </fieldset>
  );
}