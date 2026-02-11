import type { FormErrors } from '@typedef/FormErrors';

export type RangeTuple = readonly [number, number];
export type LabelObject = {
    en: string;
    ta: string;
};

export type InputRange = RangeTuple | readonly (string | LabelObject)[];

export interface PhoneNumberValue {
    country_code: string;
    phone_number: string;
    e164_number: string;
}

export interface BlockProps<T> {
    legend: string;
    onChange: (value: T) => void;
    onError: (value: FormErrors) => void;
    inputRange?: InputRange;
    className?: string;
    required?: boolean;
    disabled?: boolean;
    validate?:(value: T) => FormErrors;
}
