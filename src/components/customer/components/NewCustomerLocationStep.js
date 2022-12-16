import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { Button, FormGroup, FormLabel, FormControl } from "react-bootstrap";

import { useApiPost } from "../../../hooks/useApi";
import JoinMailingList from "../../common/JoinMailingList";

const NewCustomerLocationStep = ({ onComplete, onError }) => {
  const [formData, setFormData] = useState({
    zip: "",
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
        <FormGroup>
          <h3>Where do you need help?</h3>
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

        <div className="text-end">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            style={{ minWidth: 200 }}
            disabled={formData.zip.length < 5 || checkZip.isLoading}
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

NewCustomerLocationStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default NewCustomerLocationStep;
