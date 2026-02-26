import { 
    useMemo, 
    useContext, 
} from 'react';

import type { 
    BlockProps, 
    PhoneNumberValue 
} from '@typedef/BlockValue';

import { LanguageContext } from '@utils/languageContext';

import country from '@constants/country_prefix.json';
import styles from '@styles/blockStyles.module.css';

export default function PhoneNumber({
    legend,
    value,
    onChange,
    hasError,
    disabled = false,
    required = false,
    className = '',
}: BlockProps<PhoneNumberValue>) {
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

    const countryCode = (value?.country_code ?? '+91').trim();
    const phoneNumber = value?.phone_number ?? '';

    // Helper function for getting the country code from the json file
    const countryOptions = useMemo(
        () => country.list.map(({ callingCode, name }) => ({
        label: `${callingCode} ${name}`,
        value: callingCode,
        })),
        []
    );

    // Helper function to emit the change event with the current value
    const emitChange = (nextValue: PhoneNumberValue) => {
        onChange(nextValue);
    };

    // Event handler for country code change
    const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const nextCountryCode = event.target.value;
        const payload = buildValue(nextCountryCode, phoneNumber);
        emitChange(payload);
    };

    // Event handler for phone number change
    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const nextPhone = event.target.value;
        const payload = buildValue(countryCode, nextPhone);
        emitChange(payload);
    };

  return (
    <fieldset 
        className={`
            ${styles.fieldset} 
            ${className}
        `} 
        disabled={disabled}
    >
        <legend 
            className={`
                ${styles.legend}
                ${lang === 'ta' ? styles.fontTamil : styles.fontEnglish}
            `}
        >
            {legend} {required && <span className={styles.required}>*</span>}
        </legend>

      <div className={`
                ${styles.group} 
                ${hasError ? styles.error : ''}
            `}
        >
        <select
        name={`cc_${legend.toLowerCase().replace(/\s+/g, '_')}`}
          aria-label="Country code"
          className={styles.countrySelect}
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
          name={`ph_${legend.toLowerCase().replace(/\s+/g, '_')}`}
          className={styles.field}
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
