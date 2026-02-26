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
    value: T;
    onChange: (value: T) => void;
    hasError: boolean;
    placeholder?: string;
    inputRange?: InputRange;
    className?: string;
    required?: boolean;
    disabled?: boolean;
}
