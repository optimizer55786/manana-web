import React, { useState, useDispatch } from "reactn";
import { Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import StepProgress from "../common/StepProgress";

import NewCustomerLocationStep from "./components/NewCustomerLocationStep";
import NewCustomerServicesStep from "./components/NewCustomerServicesStep";
import NewCustomerHelperStep from "./components/NewCustomerHelperStep";
import NewCustomerAccountStep from "./components/NewCustomerAccountStep";
import NewHelperVerificationStep from "../helper/components/NewHelperVerificationStep";
import moment from "moment";

const NewCustomer = () => {
  const [step, setStep] = useState(0);
  const [completeData, setCompleteData] = useState({});
  const [title, setTitle] = useState(
    "Let's make sure Manana is available in your area."
  );
  const loginDispatch = useDispatch("login");
  const verifiedDispatch = useDispatch("verified");
  const progressJobDispatch = useDispatch("progressJobRequest");
  const history = useHistory();

  const renderStepForm = () => {
    switch (step) {
      case 4:
        return (
          <NewHelperVerificationStep
            onComplete={(res) => {
              verifiedDispatch(res);
              history.push("/find-help/continue");
            }}
            onBack={() => {}}
          />
        );
      case 3:
        return (
          <NewCustomerAccountStep
            completeData={completeData}
            onComplete={(data) => {
              loginDispatch(data);
              setTitle("Verify your account.");
              setStep(4);
              window.scrollTo(0, 0);

              // store the progress on the job request
              progressJobDispatch({
                customer: data._id,
                helper: null,
                requestFor: null,
                requestedHelpers: completeData.step2.helpers,
                jobType: completeData.step2.availabilityFilters.jobType,
                declinedBy: [],
                servicesRequested: Object.keys(completeData.step1.services).map(
                  (serviceId) => {
                    return {
                      service: serviceId,
                      options: Object.keys(
                        completeData.step1.services[serviceId]
                      ).map((option) => {
                        return {
                          key: option,
                          value: completeData.step1.services[serviceId][option],
                        };
                      }),
                    };
                  }
                ),
                dates: {
                  startDateTime: moment
                    .utc(
                      `${completeData.step2.availabilityFilters.startDate} ${completeData.step2.availabilityFilters.startTime}`,
                      "YYYY-MM-DD h:mm A"
                    )
                    .toDate(),
                  endTime: completeData.step2.availabilityFilters.endTime,
                  schedule: null,
                  endDate: null,
                },
                specializedCare: completeData.step1.dementiaCare
                  ? ["Dementia Care"]
                  : [],
                vehicleRequired: completeData.step1.vehicleRequired,
                hours: completeData.step1.hours,
                isOvernight:
                  completeData.step2.availabilityFilters.endTime ===
                  "overnight",
                viewedBy: [],
                acceptedOn: null,
                canceledOn: null,
              });
            }}
            onBack={() => setStep(2)}
          />
        );
      case 2:
        return (
          <NewCustomerHelperStep
            onComplete={(data) => {
              setStep(3);
              setTitle("Create a Manana account to complete this booking.");
              setCompleteData({ ...completeData, step2: data });
              window.scrollTo(0, 0);

              console.log("completeData: ", { ...completeData, step2: data });
            }}
            onBack={() => setStep(1)}
            serviceArea={completeData.step0.serviceArea._id}
          />
        );
      case 1:
        return (
          <NewCustomerServicesStep
            onComplete={(data) => {
              setStep(2);
              setTitle("Who would you like to send a help request to?");
              setCompleteData({ ...completeData, step1: data });
              window.scrollTo(0, 0);
            }}
            onBack={() => setStep(0)}
          />
        );
      default:
        return (
          <NewCustomerLocationStep
            onComplete={(data) => {
              setStep(1);
              setTitle("What would you like help with?");
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
            style={{ minHeight: 300, paddingTop: step === 0 ? "10%" : "35%" }}
          >
            <h1>{title}</h1>
          </div>
        </Col>
        <Col>
          {step === 0 ? null : (
            <ContentBlock>
              <StepProgress
                steps={["Services", "Helper", "Account", "Confirm"]}
                active={step - 1}
              />
            </ContentBlock>
          )}
          <ContentBlock style={{ padding: "3rem" }}>
            {renderStepForm()}
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default NewCustomer;
