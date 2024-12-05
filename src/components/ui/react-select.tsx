import { cn } from "@/utils/utils";
import React from "react";
import ReactSelect, {
  type GroupBase,
  type Props,
  type StylesConfig,
} from "react-select";

const Select = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(
  props: Props<Option, IsMulti, Group>
) => {
  const selectStyles: StylesConfig<Option, IsMulti, Group> = {
    dropdownIndicator: (provided, state) => ({
      ...provided,
      transform: state.selectProps.menuIsOpen ? "rotate(180deg)" : "",
    }),
  };
  return (
    <ReactSelect
      {...props}
      styles={selectStyles}
      className={cn("react-select", props.className)}
      classNamePrefix={"react-select"}
      isSearchable
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export default Select;
