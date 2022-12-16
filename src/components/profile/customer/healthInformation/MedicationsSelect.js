import React from "reactn";
import Select from "react-select";

const options = ["Pantoprazole"];

const MedicationsSelect = ({ value, onChange }) => {
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

export default MedicationsSelect;
