import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  Button,
  FormGroup,
  FormCheck,
  FormControl,
  Alert,
  FloatingLabel,
  Form,
  InputGroup,
  Modal
} from "react-bootstrap";
import moment from "moment-timezone";
import { useHistory } from "react-router-dom";

import Close from "@material-ui/icons/Close";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import "./css/BackgroundCheckInformationStep.css"

const BackgroundCheckInformationStep = ({ completeData, onComplete }) => {
  const history = useHistory();
  const [showCC, setShowCC] = useState(true);
  const [formData, setFormData] = useState({
    legalName: "",
    SSN: "",
    dateOfBirth: "",
    zip: "",
    DLN: "",
    state: ""
  });
  const [formError, setFormError] = useState(null);

  const onSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form onSubmit={onSubmit}>
      <h3 className="mb-4">In order to run a background check, we need additional information.</h3>      
      <p className="body1">This is the minium amount of information legally required to perform a background check.</p>
      <p className="cta">WHY DO YOU NEED A BACKGROUND CHECK?</p>
      {formError ? <Alert variant="danger">{formError}</Alert> : null}      
      <Modal show={showCC} onHide={() => setShowCC(false)}>
        <Modal.Body>
          <div className="d-flex justify-content-end">
              <Close
                onClick={() => setShowCC(false)}
              />
            </div>
          <p className="subtitle2 bold mb-4">Why a background check?</p>      
          <p className="subtitle2">The safety of the Manana community is paramount to out collective success. We require all of our Helpers to be vetted before they can begin providing help.</p>
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              style={{ minWidth: 150 }}
              onClick={() => setShowCC(false)}
            >
              OKAY
            </Button>
          </div>
        </Modal.Body>
      </Modal>
      <FormGroup className="mb-4">
        <FormControl
          type="text"
          name="legalName"
          placeholder="Full Legal Name"
          value={formData.legalName}
          required={true}
          onChange={onChange}
          style={{ display: "block" }}
        />
      </FormGroup>

      <FormGroup className="mb-4">
        <InputGroup>
            <FormControl
              type="text"
              name="SSN"
              placeholder="Social Security Number"
              value={formData.SSN}
              required={true}
              onChange={onChange}
              style={{ display: "block" }}
            />        
            <InputGroup.Text>
              <LockOutlinedIcon/>
            </InputGroup.Text>    
        </InputGroup>
      </FormGroup>

      <FormGroup className="mb-4">        
        <FloatingLabel controlId="dateOfBirth" label="Date of Birth">
          <FormControl
            type="date"
            name="dateOfBirth"
            placeholder="Date of Birth"
            required={true}
            onChange={(e) => {
              let v = e.target.value ? moment(e.target.value).toDate() : null;
              onChange({ target: { name: e.target.name, value: v } });
            }}
            value={
              formData.dateOfBirth ? moment(formData.dateOfBirth).format("YYYY-MM-DD") : ""
            }
            style={{ display: "block" }}
          />
        </FloatingLabel>
      </FormGroup>

      <FormGroup className="mb-4">        
        <FloatingLabel controlId="zip" label="ZIP CODE">
          <FormControl
            type="text"
            name="zip"
            placeholder="ZIP CODE"
            value={formData.zip}
            required={true}
            onChange={onChange}
            style={{ display: "block" }}
          />
        </FloatingLabel>
      </FormGroup>

      <FormGroup className="d-flex justify-content-between mb-4">
        <FormControl
          type="text"
          name="DLN"
          placeholder="Drivers License Number"
          value={formData.DLN}
          required={true}
          onChange={onChange}
          style={{ flex: 4, marginRight: 10 }}
        />
        <Form.Select
          size="sm"
          name="state"
          value={formData.state}
          onChange={onChange}
          style={{
            flex: 1,
            fontSize: "1rem",
          }}
        >
          <option value="">State</option>
          <option value="AL">Alabama</option>
          <option value="AK">Alaska</option>
          <option value="AZ">Arizona</option>
          <option value="AR">Arkansas</option>
          <option value="CA">California</option>
          <option value="CO">Colorado</option>
          <option value="CT">Connecticut</option>
          <option value="DE">Delaware</option>
          <option value="DC">District Of Columbia</option>
          <option value="FL">Florida</option>
          <option value="GA">Georgia</option>
          <option value="HI">Hawaii</option>
          <option value="ID">Idaho</option>
          <option value="IL">Illinois</option>
          <option value="IN">Indiana</option>
          <option value="IA">Iowa</option>
          <option value="KS">Kansas</option>
          <option value="KY">Kentucky</option>
          <option value="LA">Louisiana</option>
          <option value="ME">Maine</option>
          <option value="MD">Maryland</option>
          <option value="MA">Massachusetts</option>
          <option value="MI">Michigan</option>
          <option value="MN">Minnesota</option>
          <option value="MS">Mississippi</option>
          <option value="MO">Missouri</option>
          <option value="MT">Montana</option>
          <option value="NE">Nebraska</option>
          <option value="NV">Nevada</option>
          <option value="NH">New Hampshire</option>
          <option value="NJ">New Jersey</option>
          <option value="NM">New Mexico</option>
          <option value="NY">New York</option>
          <option value="NC">North Carolina</option>
          <option value="ND">North Dakota</option>
          <option value="OH">Ohio</option>
          <option value="OK">Oklahoma</option>
          <option value="OR">Oregon</option>
          <option value="PA">Pennsylvania</option>
          <option value="RI">Rhode Island</option>
          <option value="SC">South Carolina</option>
          <option value="SD">South Dakota</option>
          <option value="TN">Tennessee</option>
          <option value="TX">Texas</option>
          <option value="UT">Utah</option>
          <option value="VT">Vermont</option>
          <option value="VA">Virginia</option>
          <option value="WA">Washington</option>
          <option value="WV">West Virginia</option>
          <option value="WI">Wisconsin</option>
          <option value="WY">Wyoming</option>
        </Form.Select>
      </FormGroup>
      <hr />

      <div className="d-flex justify-content-between text-end mb-4">        
        <Button
          type="button"
          variant="light"
          className="btn-text-primary"
          onClick={() => {
            if (history.location.state && history.location.state.from === "login")
              history.push("/account");
            else
              history.goBack();
          }}
        >
          SKIP FOR NOW
        </Button>
        <Button
          type="submit"
          variant="primary"
          style={{ minWidth: 200 }}
          disabled={
            !formData.SSN ||
            !formData.dateOfBirth ||
            !formData.DLN ||
            !formData.zip ||
            !formData.state ||
            formData.legalName.length < 3
          }
        >
          NEXT
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

BackgroundCheckInformationStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
};

export default BackgroundCheckInformationStep;
