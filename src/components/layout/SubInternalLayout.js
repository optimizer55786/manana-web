import React from "reactn";
import PropTypes from "prop-types";
import { useHistory } from "react-router";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";

import ArrowBack from "@material-ui/icons/ArrowBack";

import InternalLayout from "./InternalLayout";

const SubInternalLayout = ({
  alert,
  alertMutate,
  alertMutateSuccessMsg = "Your changes were successfully saved.",
  title,
  onBack,
  children,
}) => {
  const history = useHistory();

  const checkAlerts = () => {
    if (alert) {
      return (
        <Alert variant={alert.variant} className="header-error">
          {alert.msg}
        </Alert>
      );
    }

    if (alertMutate) {
      if (alertMutate.error) {
        return (
          <Alert variant="danger" className="header-error">
            {alertMutate.error.message}
          </Alert>
        );
      } else if (alertMutate.isSuccess) {
        return (
          <Alert variant="success" className="header-error">
            {alertMutateSuccessMsg}
          </Alert>
        );
      }
    }

    return null;
  };

  return (
    <InternalLayout>
      {checkAlerts()}
      <Container>
        <Row>
          <Col xs={12} sm={12} md={{ span: 8, offset: 2 }}>
            <Button
              type="button"
              variant="link"
              onClick={() => {
                if (onBack) {
                  onBack();
                } else {
                  history.goBack();
                }
              }}
              className="m-0 p-0 pt-2"
            >
              <ArrowBack />
            </Button>
            <h2 className="mt-3 mb-5">{title}</h2>

            {children}
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

SubInternalLayout.propTypes = {
  alert: PropTypes.objectOf(
    PropTypes.shape({
      msg: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(["danger", "warning", "success", "info"]),
    })
  ),
  title: PropTypes.string.isRequired,
  onBack: PropTypes.func,
  children: PropTypes.node.isRequired,
};

export default SubInternalLayout;
