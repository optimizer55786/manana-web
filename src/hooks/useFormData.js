import { useState } from "reactn";

export function useFormData(defaultValues) {
  const [formData, setFormData] = useState({ ...defaultValues });
  const [hasChanged, setHasChanged] = useState(false);

  const onChange = (event) => {
    setHasChanged(true);
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const setData = (newData) => {
    setHasChanged(true);
    setFormData({
      ...formData,
      ...newData,
    });
  };

  const resetChange = () => {
    setHasChanged(false);
  };

  const resetData = (newData) => {
    setHasChanged(false);
    setFormData(newData);
  };

  const toggleCheckboxValue = (key, cbVal) => {
    let list = !Array.isArray(formData[key]) ? [] : [...formData[key]];

    if (list.includes(cbVal)) {
      list = list.filter((v) => v !== cbVal);
    } else {
      list.push(cbVal);
    }

    onChange({ target: { name: key, value: list } });
  };

  return {
    formData,
    hasChanged,
    onChange,
    resetChange,
    resetData,
    setData,
    toggleCheckboxValue,
  };
}
