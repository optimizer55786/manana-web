import React, { useGlobal, useState } from "reactn";
import { Container, Row, Col, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

import Settings from "@material-ui/icons/Settings";

import InternalLayout from "../layout/InternalLayout";
import Tabs from "../common/Tabs";
import { useApiGet } from "../../hooks/useApi";

const Payments = () => {
  const [user] = useGlobal("user");
  const [error] = useState(null);
  const [page, setPage] = useState(1);

  const { isLoading, data } = useApiGet(
    "payments",
    "/payments",
    { page, limit: 20 },
    { staleTime: 5000 }
  );

  const renderList = (list, emptyMsg) => {
    if (list.length === 0) {
      return <p className="text-center lead">{emptyMsg}</p>;
    }

    return <pre>{JSON.stringify(list, undefined, 2)}</pre>;
  };

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
            <div className="float-end">
              <Link
                to={
                  user.helper
                    ? "/account/payment-settings"
                    : "/account/recipient-payment-settings"
                }
                className="btn btn-link"
              >
                <Settings />
              </Link>
            </div>
            <h2 className="mb-5">Payments</h2>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <Tabs
                tabs={[
                  {
                    label: "UPCOMING",
                    content: renderList(
                      data.upcoming,
                      "You do not have any upcoming payments."
                    ),
                  },
                  {
                    label: "PAID",
                    content: renderList(
                      data.paid,
                      "You have not received any payments yet."
                    ),
                  },
                ]}
              />
            )}
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Payments;
