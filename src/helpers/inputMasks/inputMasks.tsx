export const alphanumericMask = (value: string) => /^[A-Za-z0-9]*$/.test(value);

export const numericMask = (value: string) => /^[0-9]*$/.test(value);

export const INPUT_MASKS = {
  alphanumeric: alphanumericMask,
  numericMask: numericMask,
};
