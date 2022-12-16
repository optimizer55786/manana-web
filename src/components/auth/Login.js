import React, { useDispatch, useEffect, useGlobal } from "reactn";
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

const Login = () => {
  const [user] = useGlobal("user");
  const [verificationToken] = useGlobal("verificationToken");
  const { formData, onChange } = useFormData({ email: "" });
  const history = useHistory();
  const login = useDispatch("login");
  
  const checkHelperBackgroundCheck = () => {
    if (user.userType === "helper" &&
      (!user.helper.backgroundCheck || !user.helper.backgroundCheck.checkrId)
    ) {
      history.push("/background-check", { from: "login" });
    } else {      
      history.push("/dashboard");
    }
  }
  const submitPost = useApiPost("/auth/login", (res) => {
    login(res.token);
    history.push("/sign-in/verify");
  });

  useEffect(() => {
    if (user !== null) {
      checkHelperBackgroundCheck();
    } else if (verificationToken !== null) {
      history.push("/sign-in/verify");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    submitPost.mutate({ email: formData.email });
  };

  return (
    <WizardLayout>
      <Row>
        <Col>
          <div
            className="align-middle"
            style={{ minHeight: 300, paddingTop: "15%" }}
          >
            <h1>Sign into your account.</h1>
          </div>
        </Col>
        <Col>
          <ContentBlock>
            <h3>Sign In</h3>
            <form onSubmit={onSubmit}>
              <p className="lead">
                Please enter your email address in the field below to start your
                sign in.
              </p>
              {submitPost.isError ? (
                <Alert variant="danger">{submitPost.error.message}</Alert>
              ) : null}
              <FormGroup>
                <FormLabel>Email</FormLabel>
                <FormControl
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
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
                {submitPost.isLoading ? "..." : "Sign In"}
              </Button>
            </form>
          </ContentBlock>
        </Col>
      </Row>
    </WizardLayout>
  );
};

export default Login;
