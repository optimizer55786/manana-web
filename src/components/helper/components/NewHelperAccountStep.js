import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormCheck,
  FormControl,
  Alert,
} from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";

import HorizontalBarWithLabel from "../../common/HorizontalBarWithLabel";
import { useApiPost } from "../../../hooks/useApi";

const NewHelperAccountStep = ({ completeData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    backgroundCheck: false,
    acceptTerms: false,
  });
  const [formError, setFormError] = useState(null);
  const registerUser = useApiPost("/register/helper", (results) => {
    onComplete(results);
  });

  const onSubmit = (e) => {
    e.preventDefault();

    if (!/^[\w]+\s+[\w]+/gi.test(formData.name)) {
      setFormError(
        "Please enter your full name - at least two words required."
      );
      return;
    }

    const payload = {
      email: formData.email.trim(),
      name: formData.name.trim(),
      helper: {
        serviceArea: completeData.step0.serviceArea._id,
        servicesOffered: Object.keys(completeData.step1.services).map(
          (serviceId) => {
            return {
              service: serviceId,
              options: Object.keys(completeData.step1.services[serviceId]).map(
                (option) => {
                  return {
                    key: option,
                    value: completeData.step1.services[serviceId][option],
                  };
                }
              ),
            };
          }
        ),
        specializedCare: completeData.step1.dementiaCare
          ? ["Dementia Care"]
          : [],
        jobTypes: completeData.step2.jobTypes,
        availableOvernight: completeData.step2.availableOvernight,
        hourlyRates: {
          standard: completeData.step2.standard,
          specialized: completeData.step2.specialized,
          overnight: completeData.step2.availableOvernight
            ? completeData.step2.overnight
            : null,
        },
        maxTravelDistance: completeData.step0.miles,
        vehicleAvailable: completeData.step1.vehicleAvailable,
        vehicleCovers: completeData.step1.vehicleCovers,
        vehicleInfo: null,
      },
      address: {
        postal: completeData.step0.zip,
      },
      settings: {
        timezone: "America/Chicago",
        mobile: null,
      },
    };

    registerUser.mutate(payload);
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

      <h3 className="mb-4">Create account</h3>

      {formError ? <Alert variant="danger">{formError}</Alert> : null}
      {registerUser.isError ? (
        <Alert variant="danger">{registerUser.error.message}</Alert>
      ) : null}

      <FormGroup className="mb-4">
        <FormControl
          type="text"
          name="name"
          placeholder="Full name"
          value={formData.name}
          required={true}
          onChange={onChange}
          style={{ display: "block" }}
        />
      </FormGroup>

      <FormGroup>
        <FormControl
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          required={true}
          onChange={onChange}
          style={{ display: "block" }}
        />
      </FormGroup>

      <HorizontalBarWithLabel label="OR" />

      <Button
        type="button"
        variant="primary"
        style={{ display: "block", width: "100%", marginBottom: "1.5rem" }}
      >
        SIGN UP WITH GOOGLE
      </Button>

      <hr />

      <p className="body1">
        To ensure the safety of our care recipients, all helpers must pass a
        background check.
      </p>

      <FormGroup className="mb-3" controlId="cb-background">
        <FormCheck
          type="checkbox"
          label="I agree to a background check"
          value={true}
          checked={formData.backgroundCheck}
          size="lg"
          onChange={(e) =>
            onChange({
              target: { name: "backgroundCheck", value: e.target.checked },
            })
          }
        />
      </FormGroup>

      <FormGroup className="mb-3" controlId="cb-terms">
        <FormCheck
          type="checkbox"
          label={
            <>
              I agree to all{" "}
              <Link to="/terms" target="_blank" rel="noopener noreferrer">
                Terms &amp; Conditions
              </Link>{" "}
              and the{" "}
              <Link
                to="/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </Link>
              .
            </>
          }
          value={true}
          checked={formData.acceptTerms}
          size="lg"
          onChange={(e) =>
            onChange({
              target: { name: "acceptTerms", value: e.target.checked },
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
          disabled={
            !formData.backgroundCheck ||
            !formData.acceptTerms ||
            formData.name.length < 3
          }
        >
          {registerUser.isLoading ? "..." : "NEXT"}
        </Button>
      </div>
    </form>
  );
};

NewHelperAccountStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewHelperAccountStep;
