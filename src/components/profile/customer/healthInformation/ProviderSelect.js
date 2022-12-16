import React from "reactn";
import Select from "react-select";
import { components } from "react-select";

const options = [
  {
    name: "SMITH, JOHN DR",
    npi: "123456789",
    phone: "123-123-1234",
    address: "123 W Main St, Tupelo, MS 38801",
    taxonomy: "Family practice",
  },
];

const Option = (props) => {
  const record = props.data.record;

  return (
    <components.Option {...props}>
      <p className="mb-0">{props.children}</p>
      <small className="text-muted">
        {record.taxonomy} &middot; {record.address}
      </small>
    </components.Option>
  );
};

const ProviderSelect = ({ value, onChange }) => {
  return (
    <Select
      components={{ Option }}
      options={options.map((o) => {
        return { value: o.npi, label: o.name, record: o };
      })}
      onChange={onChange}
      value={value}
      placeholder="Enter name..."
    />
  );
};

export default ProviderSelect;
