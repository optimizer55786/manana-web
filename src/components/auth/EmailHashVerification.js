import React, { useEffect, useDispatch } from "reactn";
import { useParams, useHistory } from "react-router-dom";
import { Row, Col, Alert } from "react-bootstrap";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import { useApiPost } from "../../hooks/useApi";

const EmailHashVerification = () => {
  const { hash } = useParams();
  const history = useHistory();
  const verifiedDispatch = useDispatch("verified");
  const callApi = useApiPost("/auth/verify", (res) => {
    verifiedDispatch(res);
    history.push("/dashboard");
  });

  useEffect(() => {
    callApi.mutate({ hash });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash]);

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: "10%" }}
          >
            <h1>Let's authorize your sign in.</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <h3>Sign In Verification</h3>
            {callApi.isError ? (
              <Alert variant="danger">{callApi.error.message}</Alert>
            ) : (
              <p className="lead">
                Please wait while we verify your sign in information.
              </p>
            )}
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default EmailHashVerification;
