import React, { useState, useDispatch, useEffect, useGlobal } from "reactn";
import { Row, Col, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import ArrowBack from "@material-ui/icons/ArrowBack";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import StepProgress from "../common/StepProgress";
import { useApiPost } from "../../hooks/useApi";

import CreditCardForm from "../common/CreditCardForm";

const NewPaymentMethod = () => {
  const [user] = useGlobal("user");
  const [title, setTitle] = useState("Create a profile.");
  const history = useHistory();
  const updateUser = useDispatch("updateUser");
  const api = useApiPost("/payments/save-payment-method", (resp) => {
    alert("Your payment information has been successfully saved.");
    history.push("/profile");
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: "35%" }}
          >
            <h1>What is your preferred method of payment?</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <StepProgress
              steps={["Services", "Helper", "Account", "Confirm"]}
              active={3}
            />
          </ContentBlock>
          <ContentBlock style={{ padding: "3rem" }}>
            <Button
              type="button"
              variant="link"
              onClick={() => alert("BACK")}
              style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
            >
              <ArrowBack />
            </Button>
            <div style={{ position: "relative" }}>
              <h3 className="mb-3">Select a payment method</h3>
              <p>
                You won't be charged until your job request is accepted. We will
                hold your funds until the service(s) have been complete. Payment
                info is only stored to secure your booking request.
              </p>

              <CreditCardForm
                buttonLabel="NEXT"
                onComplete={(setupIntent) => {
                  api.mutate({
                    paymentMethodId: setupIntent.payment_method,
                  });
                }}
              />

              <hr />
              <Button
                variant="link"
                className="w-100"
                onClick={() => alert("CANCEL")}
              >
                CANCEL
              </Button>
            </div>
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default NewPaymentMethod;
