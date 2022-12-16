import React, { useGlobal, useState } from "reactn";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import InternalLayout from "../layout/InternalLayout";
import ButtonList from "../common/ButtonList";

const Account = () => {
  const [user] = useGlobal("user");
  const [error] = useState(null);
  const history = useHistory();

  return (
    <InternalLayout>
      {error ? (
        <Alert variant="danger" className="header-error">
          {error.message}
        </Alert>
      ) : null}
      <Container>
        <Row>
          <Col xs={12} sm={12} md={{ span: 8, offset: 2 }}>
            <h2 className="mb-3">Account</h2>

            <ButtonList
              className="mt-5 mb-5"
              buttons={
                user.helper
                  ? [
                      {
                        label: "Account Settings",
                        hasContent: true,
                        onClick: () => history.push("/account/settings"),
                      },
                      {
                        label: "Payment Settings",
                        hasContent: true,
                        onClick: () =>
                          history.push("/account/payment-settings"),
                      },
                      {
                        label: "Manana Documents",
                        hasContent: true,
                        onClick: () => alert("Clicked!"),
                      },
                      {
                        label: "Tax Info",
                        hasContent: true,
                        onClick: () => history.push("/account/tax-info"),
                      },
                      {
                        label: "Notification Settings",
                        hasContent: true,
                        onClick: () =>
                          history.push("/account/helper-notification-settings"),
                      },
                    ]
                  : [
                      {
                        label: "Personal Info",
                        hasContent: true,
                        onClick: () => history.push("/account/personal-info"),
                      },
                      {
                        label: "Favorites",
                        hasContent: true,
                        onClick: () => history.push("/account/favorites"),
                      },
                      {
                        label: "Payment Settings",
                        hasContent: true,
                        onClick: () =>
                          history.push("/account/recipient-payment-settings"),
                      },
                      {
                        label: "Notification Settings",
                        hasContent: true,
                        onClick: () =>
                          history.push("/account/notification-settings"),
                      },
                    ]
              }
            />
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Account;
