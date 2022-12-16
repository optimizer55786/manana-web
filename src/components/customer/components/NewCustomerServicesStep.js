import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button, FormGroup, FormCheck } from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Remove from "@material-ui/icons/Remove";
import Add from "@material-ui/icons/Add";

import ServicesList from "../../common/ServicesList";

const NewCustomerServicesStep = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    services: {},
    vehicleRequired: false,
    dementiaCare: false,
    hours: 3,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const onChange = (e) => {
    const updates = { ...formData, [e.target.name]: e.target.value };

    // we need to pull the vehicle flags out of the services due to how
    // the form is layed out and buried within service objects
    if (e.target.name === "services") {
      if (e.target.value["60c3fd06573f8b1868c89ef2"]) {
        const acc = e.target.value["60c3fd06573f8b1868c89ef2"].accommodate;
        if (acc && acc.includes("A car isn't required")) {
          updates.vehicleRequired = false;
        } else if (acc) {
          updates.vehicleRequired = true;
        }
      }
    }

    setFormData(updates);
  };

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="button"
        variant="link"
        onClick={() => onBack()}
        style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
      >
        <ArrowBack />
      </Button>

      <ServicesList
        role="customer"
        values={formData.services}
        onChange={(selections) =>
          onChange({ target: { name: "services", value: selections } })
        }
      />
      <hr />

      <FormGroup>
        <h3>How long would you like this help?</h3>
        <p className="text-muted body1">
          A minimum of 3 hours is required per booking.
        </p>
        <Row>
          <Col className="text-center">
            <Button
              variant="secondary"
              className="btn-circle-icon"
              disabled={formData.hours <= 3}
              onClick={() => {
                setFormData({ ...formData, hours: formData.hours - 1 });
              }}
            >
              <Remove />
            </Button>
          </Col>
          <Col>
            <h3 className="text-center m-2">{formData.hours} hours</h3>
          </Col>
          <Col className="text-center">
            <Button
              variant="secondary"
              className="btn-circle-icon"
              disabled={formData.hours >= 23}
              onClick={() => {
                setFormData({ ...formData, hours: formData.hours + 1 });
              }}
            >
              <Add />
            </Button>
          </Col>
        </Row>
      </FormGroup>

      <hr />

      <h3 className="mb-3">Will you need any specialized care?</h3>
      <p className="text-muted body1">
        Specialized care will be billed at a higher rate.
      </p>
      <FormGroup className="mb-3" controlId="formBasicCheckbox">
        <FormCheck
          type="checkbox"
          id="cb-dementia-care"
          label="Dementia Care"
          value="Dementia Care"
          checked={formData.dementiaCare}
          size="lg"
          onChange={(e) =>
            onChange({
              target: { name: "dementiaCare", value: e.target.checked },
            })
          }
        />
      </FormGroup>
      <hr />

      <div className="text-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ minWidth: 200 }}
          disabled={formData.services === null}
        >
          NEXT
        </Button>
      </div>
    </form>
  );
};

NewCustomerServicesStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewCustomerServicesStep;
