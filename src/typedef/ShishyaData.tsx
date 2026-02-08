import type { FormErrors } from '@typedef/FormErrors';
import { FormState } from '@typedef/FormState';

// Data type used in Identity Information Form
export type IdentityDataType = { 
    shishya_name: string;
    country_code: string;
    phone_number: string; 
    record_locked: boolean | true; 
};

// Data type used in Basic Information Form
export type BasicDataType = {
    panchasamskaram: number;
    date_of_birth: Date | null;
    gender: number;
    marital_status: number;
    poorvikam: string;
    email: string;
    gotram: string;
    tamil_month: number;
    birthstar: number;
    profession: number;
    job_details: string;
    interests: number[];
};

// Data type used in Address Information Form
export type AddressDataType = {
    address_id: string;
    country_name: string;
    postal_code: string;
    state_name: string;
    district_name: string;
    city_name: string;
    street_name: string;
    area_name: string;
    door_no: string;
    current_address: boolean;
    current_is_permanent: boolean;
};

// Data type used in Family Member Information Form
export type FamilyMemberDataType = {
    member_name: string;
    country_code: string;
    phone_number: string;
    same_address: boolean;
    no_edit: boolean;
};

export type PreferencesType = {
    whatsapp_optin: boolean;
    wagroup_optin: boolean;
    email_optin: boolean;
    calls_optin: boolean;
    contact_current_address: boolean; // True for Current Address, False for Permanent Address
    programs: number[];
};

// The complete Shishya Data Type
export interface ShishyaDataType {
    identity: IdentityDataType;
    details: BasicDataType;
    addresses: AddressDataType[];
    family_members: FamilyMemberDataType[];
    preferences: PreferencesType;
}

export type ShishyaDataResultType = {
    count: number;
    message: string;
    current_address_id: string;
    permanent_address_id: string;
    family_id: string;
}

// An extendable common interface for Form Props
// Usage: interface SpecificFormProps extends FormProps<SpecificDataType> {}
export interface FormProps<T> {
    setParentState: (state: FormState) => void;
    currentData: T;
    updateParent: (data: T) => void;
    displayErrors: (errors: FormErrors) => void;
}