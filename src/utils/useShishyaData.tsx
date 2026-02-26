import { createContext } from 'react';

import { FormState } from '@typedef/FormState';
import type { ShishyaDataType } from '@typedef/ShishyaData';

import {
    emptyIdentityData,
    emptyBasicData,
    emptyAddressData,
    emptyCurrentAddressData,
    emptyFamilyMemberData,
    emptyPreferencesData
} from '@constants/emptyShishyaData';

export type ShishyaState = {
    formState: FormState;
    data: ShishyaDataType;
};

export type ShishyaAction =
    | { type: 'nextStep' }
    | { type: 'prevStep' }
    | { type: 'resetForm' }
    | { type: 'updateData'; payload: Partial<ShishyaDataType> };

export type ShishyaDataContextValue = {
    data: ShishyaDataType;
    updateData: (payload: Partial<ShishyaDataType>) => void;
};

export const stepOrder: FormState[] = [
    FormState.GET_IDENTITY,
    FormState.GET_ADDRESS,
    FormState.GET_BASICS,
    FormState.GET_FAMILY,
    FormState.GET_PREFERENCES,
    FormState.GET_CONFIRMATION,
    FormState.GET_COMPLETION
];

export const initialData: ShishyaDataType = {
    identity: emptyIdentityData,
    details: emptyBasicData,
    addresses: [emptyCurrentAddressData, emptyAddressData],
    family_members: [emptyFamilyMemberData],
    preferences: emptyPreferencesData
};

export const initialState: ShishyaState = {
    formState: FormState.GET_IDENTITY,
    data: initialData
};

export const getStepIndex = (currentState: FormState) => stepOrder.indexOf(currentState);

export const ShishyaDataContext = createContext<ShishyaDataContextValue | null>(null);
