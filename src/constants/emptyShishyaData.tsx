import type { 
    IdentityDataType, 
    AddressDataType, 
    BasicDataType, 
    FamilyMemberDataType
} from '@typedef/ShishyaData';


export const emptyIdentityData: IdentityDataType = { 
    shishya_name: '',
    country_code: '+91',
    phone_number: '', 
    record_locked: true, 
};

export const emptyBasicData: BasicDataType = {
    date_of_birth: null, 
    gender: -1, 
    email: '', 
    gotram: '', 
    tamil_month: -1, 
    birthstar: -1, 
    marital_status: -1, 
    panchasamskaram: -1, 
    profession: -1, 
    job_details: '',
    poorvikam: '', 
    interests: []
};

export const emptyAddressData: AddressDataType = {
    address_id: '',
    country_name: '',
    postal_code: '',
    state_name: '',
    district_name: '',
    city_name: '',
    street_name: '',
    area_name: '',
    door_no: '',
    current_is_permanent: false,
    current_address: false
};

export const emptyCurrentAddressData: AddressDataType = {
    address_id: '',
    country_name: '',
    postal_code: '',
    state_name: '',
    district_name: '',
    city_name: '',
    street_name: '',
    area_name: '',
    door_no: '',
    current_is_permanent: false,
    current_address: true
};

export const emptyFamilyMemberData: FamilyMemberDataType = {
    member_name: '',
    country_code: '+91',
    phone_number: '',
    same_address: false,
    no_edit: false
};

export const emptyPreferencesData = {
    whatsapp_optin: true,
    wagroup_optin: true,
    email_optin: true,
    calls_optin: true,
    contact_current_address: true, // True for Current Address, False for Permanent Address
    programs: []
};
