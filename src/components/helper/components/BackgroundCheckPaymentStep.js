import React, { useState, useEffect, useDispatch } from "reactn";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormLabel, FormControl, Form } from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { useApiPut } from "../../../hooks/useApi";
import paypalLogo from './img/paypal.jpg';

const BackgroundCheckPaymentStep = ({ completeData, onComplete, onError }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    payment: "",
  });
  const updateUser = useDispatch("updateUser");

  const backgroundCheck = useApiPut("/users/profile", (res) => {
    updateUser(res);
    onComplete(res);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const payload = {
      "helper.backgroundCheck": {
        checkrId: "1",
        requestedOn: new Date(),
        status: "submitted",
        legalName: completeData.step0.legalName,
        SSN: completeData.step0.SSN,
        dateOfBirth: completeData.step0.dateOfBirth,
        state: completeData.step0.state,
        zip: completeData.step0.zip,
        DLN: completeData.step0.DLN,
        payment: formData.payment
      }
    };

    backgroundCheck.mutate(payload);
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

        <FormGroup 
           className="mb-5"
           style={{letterSpacing: 1}}
        >
          <h2 className="mb-4">There is a $35 fee to run a background check.</h2>
          <p style={{fontSize: 22}}>While this is non-refundable, the average Helper rate in your area is $XX/hour, so you'll make this money back quickly.</p>

        </FormGroup>

        <FormGroup>
          <Form.Check
            label={
              <span style={{fontSize: "25px"}}>Credit card</span>
            }
            name="payment"
            type="radio"
            value="card"
            id="card"
            onChange={onChange}
          />
          <hr/>
          <Form.Check
            label={
              <img
                src={paypalLogo}
                className='img-fluid'
                alt='Paypal'
                style={{width: "26%"}}
              />
            }
            name="payment"
            type="radio"
            value="paypal"
            id="paypal"
            onChange={onChange}
          />
          <hr/>

        </FormGroup>

        <div className="d-flex justify-content-between mb-5">
          <Button
              type="button"
              variant="light"
              disabled={
                !formData.payment ||
                backgroundCheck.isLoading
              }
              className="btn-text-primary"
              onClick={() => {
                if (history.location.state && history.location.state.from === "login")
                  history.push("/account");
                else
                  history.goBack();
              }}
            >
              CANCEL
            </Button>

            <Button
              type="submit"
              variant="primary"
              style={{ minWidth: 200 }}
              disabled={
                !formData.payment ||
                backgroundCheck.isLoading
              }
            >
              {backgroundCheck.isLoading ? "..." : "SUBMIT"}
            </Button>
        </div>

        <div className="d-flex justify-content-between">
          <LockOutlinedIcon
            style={{marginRight: '0.5rem'}}
          />
          <p className="body1 text-grey">
            Your personal information is securely encrypted and never shared without your expressed consent.
          </p>
        </div>
      </form>
    );
  };

  return (
    renderForm()
  );
};

BackgroundCheckPaymentStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default BackgroundCheckPaymentStep;
