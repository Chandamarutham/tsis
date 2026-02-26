export type ErrorKey = 
  | 'name_required'
  | 'phone_required'
  | 'invalid_phone'
  | 'already_registered'
  | 'phone_verification_error'
  | 'invalid_email'
  | 'dob_required'
  | 'gender_required'
  | 'native_required'
  | 'panchasamskaram_required'
  | 'marital_status_required'
  | 'country_required'
  | 'postal_code_required'
  | 'state_required'
  | 'city_required'
  | 'street_required'
  | 'door_no_required'
  | 'residing_from_required'
  | 'postal_code_incorrect'
  | 'postal_code_not_found'
  | 'family_member_name_required'
  | 'family_member_phone_required'
  | 'family_member_phone_duplicate';

export type ErrorMessage = {
  en: string;
  ta: string;
};

export const errorMessages: Record<ErrorKey, ErrorMessage> = {
  name_required: {
    en: "Name should not be empty!",
    ta: "பெயர் விவரம் காலியாக இருக்கக்கூடாது!"
  },
  phone_required: {
    en: "Phone number is required.",
    ta: "தொலைபேசி எண் குறிப்பிடப்பட வேண்டும்."
  },
  invalid_phone: {
    en: "Invalid phone number!",
    ta: "தொலைபேசி எண் தவறாக உள்ளது!"
  },
  already_registered: {
    en: "This phone number is already registered!",
    ta: "இந்த தொலைபேசி எண் ஏற்கனவே பதிவு செய்யப்பட்டு உள்ளது!"
  },
  phone_verification_error: {
    en: "Unable to verify phone number!",
    ta: "தொலைபேசி எண்ணை சரிபார்க்க முடியவில்லை!"
  },
  invalid_email: {
    en: "Invalid email address!",
    ta: "தவறான மின்னஞ்சல் முகவரி!"
  },
  dob_required: {
    en: "Date of Birth is required!",
    ta: "பிறந்த தேதி குறிப்பிடப்பட வேண்டும்!"
  },
  gender_required: {
    en: "Gender is required!",
    ta: "பாலினம் குறிப்பிடப்பட வேண்டும்!"
  },
  native_required: {
    en: "Native place is required!",
    ta: "பூர்விகம் குறிப்பிடப்பட வேண்டும்!"
  },
  panchasamskaram_required: {
    en: "Panchasamskaram info is required!",
    ta: "பஞ்சஸம்ஸ்கார விவரம் குறிப்பிடப்பட வேண்டும்!"
  },
  marital_status_required: {
    en: "Marital status is required!",
    ta: "திருமண நிலை குறிப்பிடப்பட வேண்டும்!"
  },
  country_required: {
    en: "Country is required!",
    ta: "நாடு குறிப்பிடப்பட வேண்டும்!"
  },
  postal_code_required: {
    en: "Postal code is required!",
    ta: "பின் கோடு குறிப்பிடப்பட வேண்டும்!"
  },
  state_required: {
    en: "State is required!",
    ta: "மாநிலம் குறிப்பிடப்பட வேண்டும்!"
  },
  city_required: {
    en: "City is required!",
    ta: "நகரம் குறிப்பிடப்பட வேண்டும்!"
  },
  street_required: {
    en: "Street is required!",
    ta: "தெரு குறிப்பிடப்பட வேண்டும்!"
  },
  door_no_required: {
    en: "Door number is required!",
    ta: "வீட்டு எண் குறிப்பிடப்பட வேண்டும்!"
  },
  residing_from_required: {
    en: "Residing from date is required!",
    ta: "தொடக்க தேதி குறிப்பிடப்பட வேண்டும்!"
  },
  postal_code_incorrect: {
    en: "Postal code must be 6 digits long.",
    ta: "பின் கோடு 6 இலக்கங்கள் கொண்டதாக இருக்க வேண்டும்."
  },
  postal_code_not_found: {
    en: "No address details found for the given postal code.",
    ta: "கொடுக்கப்பட்ட பின் கோட்டிற்கு எந்த முகவரி விவரங்களும் கிடைக்கவில்லை."
  },
  family_member_name_required: {
    en: "Family member name should not be empty!",
    ta: "குடும்ப உறுப்பினர் பெயர் காலியாக இருக்கக்கூடாது!"
  },
  family_member_phone_required: {
    en: "Family member phone number should not be empty!",
    ta: "குடும்ப உறுப்பினர் தொலைபேசி எண் காலியாக இருக்கக்கூடாது!"
  },
  family_member_phone_duplicate: {
    en: "This phone number is already added for another family member!",
    ta: "இந்த தொலைபேசி எண் ஏற்கனவே மற்றொரு குடும்ப உறுப்பினருக்காக சேர்க்கப்பட்டுள்ளது!"
  }
} as const;
