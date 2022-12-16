import React, { useEffect } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, ButtonGroup, Button, Form } from "react-bootstrap";
import moment from "moment-timezone";

import Remove from "@material-ui/icons/Remove";

import { useFormData } from "../../../hooks/useFormData";

const defaultSelections = {
  jobType: "One-Time",
  startDate: moment().add(3, "days").format("YYYY-MM-DD"),
  endDate: "",
  startTime: "8:00 AM",
  endTime: "10:00 AM",
};

const TimeSelect = ({ selectName, value, onChange, hasOvernight = false }) => {
  return (
    <Form.Select name={selectName} size="sm" value={value} onChange={onChange}>
      {[
        "12:00 AM",
        "12:30 AM",
        "1:00 AM",
        "1:30 AM",
        "2:00 AM",
        "2:30 AM",
        "3:00 AM",
        "3:30 AM",
        "4:00 AM",
        "4:30 AM",
        "5:00 AM",
        "5:30 AM",
        "6:00 AM",
        "6:30 AM",
        "7:00 AM",
        "7:30 AM",
        "8:00 AM",
        "8:30 AM",
        "9:00 AM",
        "9:30 AM",
        "10:00 AM",
        "10:30 AM",
        "11:00 AM",
        "11:30 AM",
        "12:00 PM",
        "12:30 PM",
        "1:00 PM",
        "1:30 PM",
        "2:00 PM",
        "2:30 PM",
        "3:00 PM",
        "3:30 PM",
        "4:00 PM",
        "4:30 PM",
        "5:00 PM",
        "5:30 PM",
        "6:00 PM",
        "6:30 PM",
        "7:00 PM",
        "7:30 PM",
        "8:00 PM",
        "8:30 PM",
        "9:00 PM",
        "9:30 PM",
        "10:00 PM",
        "10:30 PM",
        "11:00 PM",
        "11:30 PM",
      ].map((t, i) => {
        return (
          <option key={i} value={t}>
            {t}
          </option>
        );
      })}
      {hasOvernight ? <option value="overnight">Overnight</option> : null}
    </Form.Select>
  );
};

const HelperAvailabilityForm = ({ show, toggle, selections, onApply }) => {
  const { formData, onChange, hasChanged, resetData } = useFormData(
    selections || defaultSelections
  );

  useEffect(() => {
    resetData(selections || defaultSelections);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections]);

  if (!show) {
    return null;
  }

  return (
    <div className="wizard-overlay absolute">
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

      <Form.Group className="mb-4">
        <h3>How often would you like this help?</h3>
        <ButtonGroup className="full-width">
          <Button
            onClick={() =>
              onChange({ target: { name: "jobType", value: "Recurring" } })
            }
            variant={
              formData.jobType === "Recurring"
                ? "secondary"
                : "outline-secondary"
            }
            disabled={true}
          >
            RECURRING
          </Button>{" "}
          <Button
            onClick={() =>
              onChange({ target: { name: "jobType", value: "One-Time" } })
            }
            variant={
              formData.jobType === "One-Time"
                ? "secondary"
                : "outline-secondary"
            }
          >
            ONE TIME
          </Button>
        </ButtonGroup>
      </Form.Group>

      <Form.Group className="mb-4">
        <h3>Which day?</h3>
        <Form.Control
          name="startDate"
          type="date"
          size="sm"
          onChange={onChange}
          value={formData.startDate}
        />
      </Form.Group>

      <hr />

      <Form.Group className="mb-4">
        <h3>Select a window of time that works for you.</h3>
        <p className="text-muted body1">
          The larger the window, the more available helpers.
        </p>
        <Row>
          <Col xs={5}>
            <TimeSelect
              selectName="startTime"
              value={formData.startTime}
              onChange={onChange}
            />
          </Col>
          <Col xs={2}>
            <p className="text-center pt-2">
              <Remove />
            </p>
          </Col>
          <Col xs={5}>
            <TimeSelect
              selectName="endTime"
              value={formData.endTime}
              onChange={onChange}
              hasOvernight={true}
            />
          </Col>
        </Row>
      </Form.Group>

      <Button
        variant="primary"
        className="d-block w-100"
        onClick={() => {
          onApply(formData);
          toggle();
        }}
      >
        APPLY FILTERS
      </Button>
    </div>
  );
};

HelperAvailabilityForm.propTypes = {
  show: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  selections: PropTypes.object,
  onApply: PropTypes.func.isRequired,
};

export default HelperAvailabilityForm;
