import React, { useState, useEffect } from "reactn";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import { Button, FormGroup, FormCheck, FormControl } from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

const BackgroundCheckLegalStep = ({ onComplete, onError }) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    backgroundCheck: false,
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    onComplete(formData);
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
        <h3 className="mb-4">We need your permission to initiate the background check.</h3>      
        <p className="body1">This is the minimum amount of information legally required to perform a background check.</p>
        <p className="subtitle2 mb-4">
          <span className="body2">1. Introduction.</span>
          &nbsp;The Company is committed to ensuring that the work environment is as safe as possible.
          The Company is also committed to protecting its resources and assets.
          In this regard, the Company has adopted this background check policy.
          The Company will use all information obtained during background checks solely for evaluating job applicants' or employees' suitability for employment with Company.
        </p>
        <p className="subtitle2 mb-4">
          <span className="body2">2. Scope of Background Checks.</span>
          &nbsp;The Company may conduct background checks on job applicants and employees concerning references and prior employment, as well as educational, criminal, and credit history, to the extent permitted by federal, state, and local laws.
          The Company will determine the nature and scope of the background check.
          The background check will be consistent with the needs of the job applicant's at employee's position.
        </p>
        <p className="subtitle2 mb-4">
          <span className="body2">3. Consent to Background Checks.</span>
          &nbsp;The Company will ask job applicants of employees to sign a consent form authenticating the Company to conduct a background search.
          If job applicants of employees refuse to sign the consent form, the Company may no longer consider job applicants as candidates for employment of employees may be subject to discipline, up to and including termination. If the Company discovers that job applicants of employees falsified or emitted information on consent forms, job applicants may be subject to discipline, up to and including termination.
        </p>
        <p className="subtitle2 mb-4">
          <span className="body2">4. Confidentiality.</span>
          &nbsp;The information obtained through background checks is confidential and will be shared only with individuals with an essential business need to know.
        </p>
        <p className="subtitle2 mb-4">
          <span className="body2">5. Offers of Employment and Continued Employment.</span>
          &nbsp;An offer of employment made by the Company or continued employment may be the Company or continued employment may be contingent upon the successful completion of a background check.
        </p>
        <p className="body2">
        Acknowledgment.
        </p>
        <FormGroup className="mb-3" controlId="cb-background">
          <FormCheck
            type="checkbox"
            label="I acknowledge that I have received, read, understand, and will abide by the Company's Background Check Policy. I understand that this policy is not an employment contract and does not change my status as an at-will employee."
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
              !formData.backgroundCheck
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

  return (
    renderForm()
  );
};

BackgroundCheckLegalStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onError: PropTypes.func,
};

export default BackgroundCheckLegalStep;
