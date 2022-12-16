import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";

import { useApiPost } from "../../../hooks/useApi";
import JoinMailingList from "../../common/JoinMailingList";

const NewHelperLocationStep = ({ onComplete, onError }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    zip: "",
    miles: 20,
    serviceArea: null,
  });
  const checkZip = useApiPost("/service-area/check-zip", (res) => {
    onComplete({ ...formData, serviceArea: res });
  });

  useEffect(() => {
    if (checkZip.error) {
      onError(checkZip.error);
    }
  }, [checkZip.error, onError]);

  const onSubmit = async (e) => {
    e.preventDefault();

    checkZip.mutate({ ...formData });
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const renderForm = () => {
    return (
      <form onSubmit={onSubmit}>
        <Button
          type="button"
          variant="link"
          onClick={() => history.goBack()}
          style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
        >
          <ArrowBack />
        </Button>

        <FormGroup>
          <h3>What's your zip code?</h3>
          <FormControl
            type="text"
            maxLength={5}
            name="zip"
            placeholder="Zip code"
            style={{ width: 150 }}
            value={formData.zip}
            onChange={onChange}
            required
          />
        </FormGroup>
        <hr />

        <FormGroup>
          <h3>How far are you willing to travel to provide help?</h3>
          <FormControl
            type="text"
            maxLength={3}
            name="miles"
            placeholder="Miles"
            style={{ width: 150, display: "inline-block" }}
            value={formData.miles}
            onChange={onChange}
            required
          />{" "}
          <span style={{ fontSize: "1.25rem", fontWeight: 600 }}>miles</span>
        </FormGroup>
        <hr />

        <div className="text-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ minWidth: 200 }}
            disabled={
              formData.zip.length < 5 ||
              formData.miles.length === 0 ||
              checkZip.isLoading
            }
          >
            {checkZip.isLoading ? "..." : "NEXT"}
          </Button>
        </div>
      </form>
    );
  };

  return checkZip.isError ? (
    <JoinMailingList
      userType="helper"
      additionalData={{ zip: formData.zip, miles: formData.miles }}
    />
  ) : (
    renderForm()
  );
};

NewHelperLocationStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default NewHelperLocationStep;
