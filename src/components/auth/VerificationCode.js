import React, { useEffect, useGlobal, useDispatch } from "reactn";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  Button,
  Alert,
} from "react-bootstrap";

import WizardLayout from "../layout/WizardLayout";
import ContentBlock from "../common/ContentBlock";
import { useApiPost } from "../../hooks/useApi";
import { useFormData } from "../../hooks/useFormData";

const VerificationCode = () => {
  const [user] = useGlobal("user");
  const [verificationToken] = useGlobal("verificationToken");
  const { formData, onChange } = useFormData({ code: "" });
  const history = useHistory();
  const verified = useDispatch("verified");


  const checkHelperBackgroundCheck = (user) => {
    if (user.userType === "helper" &&
      (!user.helper.backgroundCheck || !user.helper.backgroundCheck.checkrId)
    ) {      
      history.push("/background-check", { from: "login" });
    } else {      
      history.push("/dashboard");
    }
  }

  const submitPost = useApiPost("/auth/verify", (res) => {
    verified(res);
    checkHelperBackgroundCheck(res);
  });

  useEffect(() => {
    if (user !== null) {
      checkHelperBackgroundCheck(user);
    } else if (!verificationToken) {
      history.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    submitPost.mutate({ token: verificationToken, code: formData.code });
  };

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: "15%" }}
          >
            <h1>Enter your verification code.</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <h3>Verification Code</h3>
            <form onSubmit={onSubmit}>
              <p className="lead">
                Please enter the verification code we sent you to continue.
              </p>
              {submitPost.isError ? (
                <Alert variant="danger">{submitPost.error.message}</Alert>
              ) : null}
              <FormGroup>
                <FormLabel>Code</FormLabel>
                <FormControl
                  name="code"
                  type="text"
                  placeholder="Code"
                  value={formData.code}
                  required={true}
                  onChange={onChange}
                />
              </FormGroup>
              <hr />

              <Button
                type="submit"
                variant="primary"
                disabled={submitPost.isLoading}
              >
                {submitPost.isLoading ? "..." : "Verify"}
              </Button>
            </form>
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default VerificationCode;
