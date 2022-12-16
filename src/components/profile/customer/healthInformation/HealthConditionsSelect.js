import React from "reactn";
import Select from "react-select";

const options = ["Alzheimer's Disease"];

const HealthConditionsSelect = ({ value, onChange }) => {
  return (
    <Select
      options={options.map((o) => {
        return { value: o, label: o };
      })}
      onChange={onChange}
      value={value}
      placeholder="Enter name..."
    />
  );
};

export default HealthConditionsSelect;
