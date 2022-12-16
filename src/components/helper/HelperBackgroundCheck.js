import React, { useState, useDispatch } from "reactn";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import StepProgress from "../common/StepProgress";

import BackgroundCheckInformationStep from "./components/BackgroundCheckInformationStep";
import BackgroundCheckLegalStep from "./components/BackgroundCheckLegalStep";
import BackgroundCheckPaymentStep from "./components/BackgroundCheckPaymentStep";

const NewHelper = () => {
  const [step, setStep] = useState(0);
  const [completeData, setCompleteData] = useState({});
  const [title, setTitle] = useState("Please provide your information");
  const loginDispatch = useDispatch("login");
  const verifiedDispatch = useDispatch("verified");
  const history = useHistory();

  const renderStepForm = () => {
    switch (step) {
      case 2:
        return (
          <BackgroundCheckPaymentStep
            completeData={completeData}
            onComplete={(data) => {
              if (history.location.state && history.location.state.from === "login")
                history.push("/account");
              else
                history.goBack();
            }}
            onBack={() => setStep(1)}
          />
        );
      case 1:
        return (
          <BackgroundCheckLegalStep
            onComplete={(data) => {
              setStep(2);
              setTitle("Please provide payment option.");
              setCompleteData({ ...completeData, step1: data });
              window.scrollTo(0, 0);
            }}
            onBack={() => setStep(0)}
          />
        );
      default:
        return (
          <BackgroundCheckInformationStep
            onComplete={(data) => {
              setStep(1);
              setTitle("We need your permission");
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
              steps={["Information", "Legal", "$35 Fee"]}
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
