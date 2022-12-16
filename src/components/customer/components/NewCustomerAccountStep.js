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

const NewCustomerAccountStep = ({ completeData, onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    acceptTerms: false,
  });
  const [formError, setFormError] = useState(null);
  const registerUser = useApiPost("/register/customer", (results) => {
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
      customer: {
        serviceArea: completeData.step0.serviceArea._id,
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

      <FormGroup className="mb-3" controlId="cb-terms">
        <FormCheck
          type="checkbox"
          id="cb-agree-terms"
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
          disabled={!formData.acceptTerms || formData.name.length < 3}
        >
          {registerUser.isLoading ? "..." : "NEXT"}
        </Button>
      </div>
    </form>
  );
};

NewCustomerAccountStep.propTypes = {
  completeData: PropTypes.object.isRequired,
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewCustomerAccountStep;
