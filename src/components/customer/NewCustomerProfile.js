import React, { useState, useDispatch, useEffect, useGlobal } from "reactn";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import StepProgress from "../common/StepProgress";

import CustomerJobProfileStep from "./components/CustomerJobProfileStep";
import CustomerJobConfirmStep from "./components/CustomerJobConfirmStep";

const NewCustomerProfile = () => {
  const [jobRequest] = useGlobal("jobRequest");
  const [step, setStep] = useState(0);
  const [completeData, setCompleteData] = useState({});
  const [title, setTitle] = useState("Create a profile.");
  const progressJobDispatch = useDispatch("progressJobRequest");
  const history = useHistory();

  const renderStepForm = () => {
    switch (step) {
      case 1:
        return (
          <CustomerJobConfirmStep
            onComplete={(data) => {
              window.localStorage.removeItem("jobRequest");
              history.push("/find-help/payment");
            }}
            onBack={() => {}}
          />
        );
      default:
        return (
          <CustomerJobProfileStep
            onComplete={(data) => {
              setStep(1);
              setTitle("If everything looks correct, send your request.");
              setCompleteData({ ...completeData, step0: data });
              progressJobDispatch({
                requestFor:
                  data.jobRequestFor === "me"
                    ? null
                    : data._profileUpdates.customer.patients[0]._id,
              });
              window.scrollTo(0, 0);
            }}
            onBack={(err) => {
              alert("Go back to where?");
            }}
          />
        );
    }
  };

  useEffect(() => {
    if (!jobRequest) {
      // send the user the dashboard if we don't have a job request object saved
      history.push("/");
    } else if (jobRequest.requestFor) {
      // we already know who the job is for so lets step forward
      setStep(1);
      setTitle("If everything looks correct, send your request.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: step === 0 ? "10%" : "35%" }}
          >
            <h1>{title}</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <StepProgress
              steps={["Services", "Helper", "Account", "Confirm"]}
              active={step + 2}
            />
          </ContentBlock>
          <ContentBlock style={{ padding: "3rem" }}>
            {renderStepForm()}
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default NewCustomerProfile;
