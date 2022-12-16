import React, { useState, useGlobal } from "reactn";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormControl,
  Alert,
} from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";

import { useApiPost } from "../../../hooks/useApi";

const NewHelperVerificationStep = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    code: "",
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
    code7: "",
    code8: "",
  });
  const [verificationToken] = useGlobal("verificationToken");
  const callApi = useApiPost(`/register/verify`, (res) => {
    onComplete(res);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    callApi.mutate({ token: verificationToken._token, code: formData.code });
  };

  const onKeyDown = (e) => {
    if (
      !/^\d{1,}$/g.test(e.key) &&
      e.key !== "Delete" &&
      e.key !== "Backspace"
    ) {
      e.preventDefault();
      return;
    }

    const updates = { ...formData, [e.target.name]: e.key };
    let moveForward = true;

    if (["Delete", "Backspace"].includes(e.key)) {
      updates[e.target.name] = "";
      moveForward = false;
    }

    updates.code = `${updates.code1}${updates.code2}${updates.code3}${updates.code4}${updates.code5}${updates.code6}${updates.code7}${updates.code8}`;
    setFormData(updates);

    if (moveForward) {
      const form = e.target.form;
      const index = Array.prototype.indexOf.call(form, e.target);
      form.elements[index + 1].focus();
    }
  };

  const renderInputs = () => {
    const inputs = [];

    for (let i = 1; i <= 6; i++) {
      inputs.push(
        <Col key={i}>
          <FormControl
            type="text"
            maxLength={1}
            name={`code${i + 1}`}
            value={formData[`code${i + 1}`]}
            onKeyDown={onKeyDown}
            onChange={() => {}}
            required={true}
            focus={i === 1}
          />
        </Col>
      );
    }

    return <Row>{inputs}</Row>;
  };

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="button"
        variant="link"
        onClick={() => onBack()}
        style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
        disabled={true}
      >
        <ArrowBack />
      </Button>

      <h3 className="mb-3">Enter your verification code to continue.</h3>
      <p className="text-muted">
        A verification code was sent to the email address you provided on the previous screen.
      </p>
      {callApi.isError ? (
        <Alert variant="danger">{callApi.error.message}</Alert>
      ) : null}
      <FormGroup>{renderInputs()}</FormGroup>
      <hr />

      <div className="text-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ minWidth: 200 }}
          disabled={formData.code.length < 6 || callApi.isLoading}
        >
          NEXT
        </Button>
      </div>
    </form>
  );
};

NewHelperVerificationStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewHelperVerificationStep;
