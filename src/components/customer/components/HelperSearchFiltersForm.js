import React, { useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button, Form } from "react-bootstrap";

import Remove from "@material-ui/icons/Remove";

import { useFormData } from "../../../hooks/useFormData";
import LanguagesSelector from "../../common/LanguagesSelector";

const HelperSearchFiltersForm = ({
  show,
  toggle,
  filters,
  onApply,
  onClear,
}) => {
  const { formData, onChange, toggleCheckboxValue, resetData } = useFormData({
    ...filters,
  });

  useEffect(() => {
    resetData({ ...filters });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  if (!show) {
    return null;
  }

  return (
    <div className="wizard-overlay">
      <Button
        type="button"
        variant="link"
        onClick={() => {
          toggle();
        }}
        className="wizard-overlay__close-icon"
      >
        &times;
      </Button>
      <h2 className="mb-4">Other Filters</h2>

      <Form.Group className="mb-4">
        <h3>Gender</h3>
        {[
          {
            label: "Male",
            value: "Male",
          },
          {
            label: "Female",
            value: "Female",
          },
        ].map((opt, i) => {
          return (
            <Form.Check
              type="checkbox"
              id={`cb-gender-${i}`}
              key={i}
              label={opt.label}
              value={opt.value}
              checked={formData.gender.includes(opt.value)}
              onChange={(e) => toggleCheckboxValue("gender", e.target.value)}
            />
          );
        })}
      </Form.Group>

      <Form.Group className="mb-4">
        <h3>Age</h3>
        <Row>
          <Col xs={1} className="pt-2">
            <Form.Check
              type="checkbox"
              id="cb-age"
              label={null}
              value={formData.age ? 1 : 0}
              checked={formData.age}
              onChange={(e) =>
                onChange({ target: { name: "age", value: e.target.checked } })
              }
            />
          </Col>
          <Col xs={3}>
            <Form.Control
              type="number"
              size="sm"
              value={formData.ageMin}
              onChange={(e) =>
                onChange({ target: { name: "ageMin", value: e.target.value } })
              }
            />
          </Col>
          <Col xs={1} className="text-center pt-2">
            <Remove />
          </Col>
          <Col xs={3}>
            <Form.Control
              type="number"
              size="sm"
              value={formData.ageMax}
              onChange={(e) =>
                onChange({ target: { name: "ageMax", value: e.target.value } })
              }
            />
          </Col>
          <Col>&nbsp;</Col>
        </Row>
      </Form.Group>

      <Form.Group className="mb-4">
        <h3>Languages spoken</h3>
        <LanguagesSelector
          languages={formData.languages}
          onChange={onChange}
          emptyMsg={null}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <h3>Licenses</h3>
        {[
          {
            label: "Certified Nursing Assistant (CNA)",
            value: "Certified Nursing Assistant (CNA)",
          },
          {
            label: "Licensed Practical Nurse (LPN)",
            value: "Licensed Practical Nurse (LPN)",
          },
          {
            label: "Registered Nurse (RN)",
            value: "Registered Nurse (RN)",
          },
        ].map((opt, i) => {
          return (
            <Form.Check
              type="checkbox"
              key={i}
              id={`cb-licenses-${i}`}
              label={opt.label}
              value={opt.value}
              checked={formData.licenses.includes(opt.value)}
              onChange={(e) => toggleCheckboxValue("licenses", e.target.value)}
            />
          );
        })}
      </Form.Group>

      <br />
      <br />
      <Row>
        <Col>
          <Button
            type="button"
            variant="link"
            onClick={() => {
              toggle();
              onClear();
            }}
          >
            CLEAR ALL
          </Button>
        </Col>
        <Col className="text-end">
          <Button
            type="button"
            className="add-padding"
            onClick={() => {
              toggle();
              onApply({ ...formData });
            }}
          >
            APPLY FILTERS
          </Button>
        </Col>
      </Row>
    </div>
  );
};

HelperSearchFiltersForm.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  filters: PropTypes.object.isRequired,
  onApply: PropTypes.func.isRequired,
  onClear: PropTypes.func.isRequired,
};

export default HelperSearchFiltersForm;
