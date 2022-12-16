import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";

import Edit from "@material-ui/icons/Edit";
import Check from "@material-ui/icons/Check";
import Close from "@material-ui/icons/Close";

import { useApiWrite } from "../../hooks/useApi";

import "react-phone-input-2/lib/style.css";

const InlineEditor = ({
  name,
  value,
  label,
  fieldType = "text",
  fieldPlaceholder = "",
  fieldOptions = [],
  saveUrl,
  saveMethod = "put",
  onBeforeSave,
  onSuccess,
  onCancel,
}) => {
  const [val, setVal] = useState(value);
  const [originalVal, setOriginalVal] = useState(value);
  const [edit, setEdit] = useState(false);
  const save = useApiWrite(saveUrl, saveMethod, (res) => {
    onSuccess(res);
    setEdit(false);
    setOriginalVal(value);
  });

  const saveData = () => {
    let payload = onBeforeSave
      ? onBeforeSave({ [name]: val })
      : { [name]: val };
    save.mutate(payload);
  };

  const renderValue = () => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
      return "-";
    } else if (Array.isArray(val)) {
      return <Form.Text>{val.join(", ")}</Form.Text>;
    }

    return <Form.Text>{val}</Form.Text>;
  };

  const toggleCheckboxValue = (cbVal) => {
    let list = !Array.isArray(val) ? [] : [...val];

    if (list.includes(cbVal)) {
      list = list.filter((v) => v !== cbVal);
    } else {
      list.push(cbVal);
    }

    setVal(list);
  };

  const renderControl = () => {
    switch (fieldType) {
      case "select":
        return (
          <Form.Select
            name={name}
            onChange={(e) => setVal(e.target.value)}
            value={val}
          >
            {fieldOptions.map((opt, i) => (
              <option value={opt.value} key={i}>
                {opt.label}
              </option>
            ))}
          </Form.Select>
        );
      case "checkbox":
        return (
          <>
            {fieldOptions.map((opt, i) => {
              return (
                <Form.Check
                  type="checkbox"
                  id={`${name}-${i}`}
                  key={i}
                  label={opt.label}
                  value={opt.value}
                  checked={val && Array.isArray(val) && val.includes(opt.value)}
                  onChange={(e) => toggleCheckboxValue(e.target.value)}
                />
              );
            })}
          </>
        );
      case "phone":
        return (
          <PhoneInput
            country="us"
            value={val}
            onChange={(phone) => setVal(phone)}
          />
        );
      default:
        return (
          <Form.Control
            type={fieldType}
            name={name}
            value={val}
            placeholder={fieldPlaceholder}
            onChange={(e) => setVal(e.target.value)}
            style={{ fontSize: "1rem" }}
          />
        );
    }
  };

  return (
    <Form.Group>
      <Row>
        <Col xs={12} sm={6}>
          <Form.Label>{label}</Form.Label>
        </Col>
        <Col xs={12} sm={6} className="text-end">
          {edit ? (
            <Button
              type="button"
              variant="link"
              disabled={save.isLoading}
              onClick={() => {
                saveData();
              }}
            >
              {save.isLoading ? "..." : <Check />}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="link"
            onClick={() => {
              if (edit && onCancel) {
                onCancel();
              }
              setEdit(!edit);
              setVal(originalVal);
              save.reset();
            }}
          >
            {edit ? <Close /> : <Edit />}
          </Button>
        </Col>
      </Row>
      {save.isError && edit ? (
        <Alert variant="danger">{save.error.message}</Alert>
      ) : null}
      {edit ? renderControl() : renderValue()}
    </Form.Group>
  );
};

InlineEditor.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  label: PropTypes.string.isRequired,
  fieldType: PropTypes.oneOf([
    "text",
    "textarea",
    "select",
    "checkbox",
    "radio",
    "phone",
    "date",
  ]),
  fieldPlaceholder: PropTypes.string,
  fieldOptions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  saveUrl: PropTypes.string.isRequired,
  saveMethod: PropTypes.oneOf(["post", "put"]).isRequired,
  onBeforeSave: PropTypes.func,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default InlineEditor;
