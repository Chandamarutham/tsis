export const FormState = {
  GET_IDENTITY: 0,
  GET_ADDRESS: 1,
  GET_BASICS: 2,
  GET_FAMILY: 3,
  GET_PREFERENCES: 4,
  GET_CONFIRMATION: 5
} as const;
export type FormState = typeof FormState[keyof typeof FormState];
