import React from "reactn";
import PropTypes from "prop-types";
import { Form } from "react-bootstrap";
import Select from "react-select";

import Delete from "@material-ui/icons/Delete";
import { getLanguageNames } from "../../lib/languageHelpers";
import ButtonList from "./ButtonList";

const getOptions = () => {
  const names = getLanguageNames();
  return names.map((n) => {
    return { label: n, value: n };
  });
};

const LanguagesSelector = ({
  languages,
  onChange,
  emptyMsg = "Please select one or more languages.",
}) => {
  return (
    <>
      <Form.Group>
        <Select
          options={getOptions()}
          isMulti={false}
          isSearchable={true}
          value={[]}
          onChange={(sel) => {
            const changes = [...languages, sel.value];
            onChange({ target: { name: "languages", value: changes } });
          }}
        />
      </Form.Group>

      <ButtonList
        className="mt-4"
        buttons={languages.map((l, i) => {
          return {
            label: l,
            icon: <Delete />,
            onClick: () => {
              const changes = [...languages].filter((lang) => lang !== l);
              onChange({ target: { name: "languages", value: changes } });
            },
          };
        })}
        emptyMsg={emptyMsg}
        styles={{ borderTop: "none" }}
      />
    </>
  );
};

LanguagesSelector.propTypes = {
  languages: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
  emptyMsg: PropTypes.string,
};

export default LanguagesSelector;
