import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Button, FormGroup, FormControl, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import { useApiPost } from "../../hooks/useApi";

const JoinMailingList = ({
  title,
  message,
  userType,
  onComplete,
  additionalData,
}) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
  });
  const saveEmail = useApiPost("/service-area/add-email", (res) => {
    if (typeof onComplete === "function") {
      onComplete(res);
    }
  });

  useEffect(() => {
    if (saveEmail.isSuccess) {
      alert("You have been successfully added to the mailing list.");
      history.push("/");
    }
  }, [saveEmail.isSuccess, history]);

  const onSubmit = (e) => {
    e.preventDefault();
    saveEmail.mutate({ ...formData, userType, meta: additionalData || null });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit}>
      <h3>{title || "Join our mailing list."}</h3>
      <p>
        {message ||
          "We are working on getting set up in your area. Join our mailing list to know when sign up is possible."}
      </p>
      {saveEmail.isError ? (
        <Alert variant="danger">{saveEmail.error.message}</Alert>
      ) : null}
      <FormGroup>
        <FormControl
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={onChange}
          required
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
            formData.email.length < 5 ||
            saveEmail.isLoading ||
            saveEmail.isSuccess
          }
        >
          {saveEmail.isLoading ? "..." : "NEXT"}
        </Button>
      </div>
    </form>
  );
};

JoinMailingList.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  userType: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
  additionalData: PropTypes.object,
};

export default JoinMailingList;
