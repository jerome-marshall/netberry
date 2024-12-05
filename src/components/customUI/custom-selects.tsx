import type { FC } from "react";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { FormControl } from "../ui/form";
import type { SelectProps } from "@radix-ui/react-select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps extends SelectProps {
  onValueChange: (newValue: string) => void;
  defaultValue: string;
  options: Option[] | undefined;
}

export const CustomFormSelect: FC<CustomSelectProps> = ({
  onValueChange,
  defaultValue,
  options,
  ...props
}) => {
  return (
    <Select
      onValueChange={onValueChange}
      defaultValue={defaultValue}
      {...props}
    >
      <FormControl>
        <SelectTrigger>
          <SelectValue placeholder="Select an option" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {options?.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
