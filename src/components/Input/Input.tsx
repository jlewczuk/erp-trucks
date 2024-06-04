import React from "react";
import styled from "styled-components";
import { MaskEnum } from "../../enums";
import { INPUT_MASKS } from "../../helpers/inputMasks/inputMasks";

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const Label = styled.label`
  margin-bottom: 5px;
  color: var(--text-color);
  font-size: 14px;
`;

const InputField = styled.input`
  height: 40px;
  border: var(--input-border);
  border-radius: 4px;
  padding: 0 10px;
  font-size: var(--font-size-md);
  color: var(--text-color);

  &:disabled {
    background-color: var(--input-background-disabled);
    cursor: var(--cursor-not-allowed);
  }

  &:focus {
    outline: none;
    border-color: #333;
  }
`;

type InputProps = {
  label?: string;
  type: string;
  placeholder?: string;
  name: string;
  value: string | number | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  mask?: MaskEnum;
  required?: boolean;
  disabled?: boolean;
};

export const Input = ({
  label,
  type,
  placeholder,
  name,
  value,
  onChange,
  mask,
  required,
  disabled,
}: InputProps) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    if (mask && INPUT_MASKS[mask]) {
      newValue = (INPUT_MASKS[mask](newValue) ? newValue : value) as string;
    }
    e.target.value = newValue;
    onChange(e);
  };

  const inputId = `${name}-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <InputWrapper>
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <InputField
        id={inputId}
        type={type || "text"}
        name={name}
        value={value || ""}
        onChange={handleInputChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
    </InputWrapper>
  );
};
