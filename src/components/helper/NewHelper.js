import React, { useState, useDispatch } from "reactn";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import StepProgress from "../common/StepProgress";

import NewHelperLocationStep from "./components/NewHelperLocationStep";
import NewHelperServicesStep from "./components/NewHelperServicesStep";
import NewHelperBusinessStep from "./components/NewHelperBusinessStep";
import NewHelperAccountStep from "./components/NewHelperAccountStep";
import NewHelperVerificationStep from "./components/NewHelperVerificationStep";

const NewHelper = () => {
  const [step, setStep] = useState(0);
  const [completeData, setCompleteData] = useState({});
  const [title, setTitle] = useState("Where are you located?");
  const loginDispatch = useDispatch("login");
  const verifiedDispatch = useDispatch("verified");
  const history = useHistory();

  const renderStepForm = () => {
    switch (step) {
      case 4:
        return (
          <NewHelperVerificationStep
            onComplete={(res) => {
              verifiedDispatch(res);
              history.push("/background-check");
            }}
            onBack={() => {}}
          />
        );
      case 3:
        return (
          <NewHelperAccountStep
            completeData={completeData}
            onComplete={(data) => {
              loginDispatch(data);
              setStep(4);
              setTitle("Verify your account.");
              window.scrollTo(0, 0);
            }}
            onBack={() => setStep(2)}
          />
        );
      case 2:
        return (
          <NewHelperBusinessStep
            onComplete={(data) => {
              setStep(3);
              setTitle(
                "To connect you with individuals, we'll need to create your Manana account."
              );
              setCompleteData({ ...completeData, step2: data });
              window.scrollTo(0, 0);
            }}
            onBack={() => setStep(1)}
          />
        );
      case 1:
        return (
          <NewHelperServicesStep
            onComplete={(data) => {
              setStep(2);
              setTitle("Let's set up your business.");
              setCompleteData({ ...completeData, step1: data });
              window.scrollTo(0, 0);
            }}
            onBack={() => setStep(0)}
          />
        );
      default:
        return (
          <NewHelperLocationStep
            onComplete={(data) => {
              setStep(1);
              setTitle("What help are you willing to provide?");
              setCompleteData({ ...completeData, step0: data });
              window.scrollTo(0, 0);
            }}
            onError={(err) => {
              setTitle(err.message);
            }}
          />
        );
    }
  };

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: "35%" }}
          >
            <h1>{title}</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <StepProgress
              steps={["Location", "Services", "Business", "Account"]}
              active={step}
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

export default NewHelper;
