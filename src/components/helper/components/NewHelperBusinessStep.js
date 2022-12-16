import React, { useState } from "reactn";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormCheck,
  FormControl,
  InputGroup,
} from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";

const NewHelperBusinessStep = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    standard: 20,
    specialized: 40,
    overnight: 100,
    availableOvernight: true,
    jobTypes: [],
  });

  const onSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      <h3 className="mb-3">What's your hourly rate?</h3>

      <FormGroup>
        <p className="subtitle2">EVERYDAY TASKS</p>
        <p className="text-muted body1">
          The average rate for help providers in your area for everyday tasks is
          $XX.
        </p>
        <Row>
          <Col xs={6} sm={4}>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl
                type="number"
                name="standard"
                placeholder="$20"
                value={formData.standard}
                onChange={onChange}
                required={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <span style={{ fontSize: "1.5rem" }}>per hour</span>
          </Col>
        </Row>
      </FormGroup>

      <hr />

      <FormGroup>
        <p className="subtitle2">SPECIALIZED SERVICES</p>
        <p className="text-muted body1">
          The average rate for help providers in your area for specialized
          services is $XX.
        </p>
        <Row>
          <Col xs={6} sm={4}>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl
                type="number"
                name="specialized"
                placeholder="$40"
                value={formData.specialized}
                onChange={onChange}
                required={true}
              />
            </InputGroup>
          </Col>
          <Col>
            <span style={{ fontSize: "1.5rem" }}>per hour</span>
          </Col>
        </Row>
      </FormGroup>

      <hr />

      <FormGroup>
        <p className="subtitle2">OVERNITE RATE</p>
        <p className="text-muted body1">
          The average overnight rate for help providers in your area is $XX.
        </p>
        <Row>
          <Col xs={6} sm={4}>
            <InputGroup>
              <InputGroup.Text>$</InputGroup.Text>
              <FormControl
                type="number"
                name="overnight"
                value={!formData.availableOvernight ? "" : formData.overnight}
                disabled={!formData.availableOvernight}
                required={formData.availableOvernight}
                onChange={onChange}
              />
            </InputGroup>
          </Col>
          <Col>
            <span style={{ fontSize: "1.5rem" }}>a night</span>
          </Col>
        </Row>
      </FormGroup>
      <br />

      <FormGroup className="mb-3">
        <FormCheck
          type="checkbox"
          label="I'm unavailable for overnight work"
          value={true}
          checked={!formData.availableOvernight}
          size="lg"
          onChange={(e) =>
            onChange({
              target: { name: "availableOvernight", value: !e.target.checked },
            })
          }
        />
      </FormGroup>
      <hr />

      <h3 className="mb-3">What type of jobs are you looking for?</h3>
      <FormGroup className="mb-3">
        <FormCheck
          type="checkbox"
          label="One-time jobs"
          value="One-Time"
          checked={formData.jobTypes.includes("One-Time")}
          size="lg"
          onChange={(e) => {
            let types = formData.jobTypes;

            if (e.target.checked) {
              types.push("One-Time");
            } else {
              types = types.filter((v) => v !== "One-Time");
            }
            onChange({
              target: { name: "jobTypes", value: types },
            });
          }}
        />
      </FormGroup>
      <FormGroup className="mb-3">
        <FormCheck
          type="checkbox"
          label="Recurring jobs"
          value="Recurring"
          checked={formData.jobTypes.includes("Recurring")}
          size="lg"
          onChange={(e) => {
            let types = formData.jobTypes;

            if (e.target.checked) {
              types.push("Recurring");
            } else {
              types = types.filter((v) => v !== "Recurring");
            }
            onChange({
              target: { name: "jobTypes", value: types },
            });
          }}
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

NewHelperBusinessStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewHelperBusinessStep;
