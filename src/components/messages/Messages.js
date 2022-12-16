import React, { useState, useGlobal } from "reactn";
import { useHistory } from "react-router-dom";
import { Container, Row, Col, Alert, Badge } from "react-bootstrap";
import moment from "moment-timezone";

import InternalLayout from "../layout/InternalLayout";
import ButtonList from "../common/ButtonList";
import ProfilePicture from "../common/ProfilePicture";
import { useApiGet } from "../../hooks/useApi";

const Messages = () => {
  const [user] = useGlobal("user");
  const [error] = useState(null);
  const history = useHistory();

  const { isLoading, data } = useApiGet(
    "messages",
    "/communications/conversations",
    null,
    { staleTime: 5000 }
  );

  const renderTitle = (msg) => {
    switch (msg.messages[0].communicationType) {
      case "system":
        return <h5>Manana Support</h5>;
      case "job":
        return <h5>New help request</h5>;
      default:
        return (
          <h5>
            {msg.date} with {msg.user.name}
          </h5>
        );
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <h3>Loading...</h3>;
    }

    return (
      <>
        <h2 className="mb-3">Messages</h2>
        <ButtonList
          hover={true}
          className="mt-5 mb-5"
          buttons={data.map((convo) => {
            return {
              render: () => {
                return (
                  <Row>
                    <Col xs={2} sm={1}>
                      <ProfilePicture user={convo.user} />
                    </Col>
                    <Col xs={10} sm={11}>
                      <div className="float-end">
                        <span className="text-muted">
                          {moment(convo.messages[0].date)
                            .format("MMM D")
                            .toUpperCase()}
                        </span>
                        {!convo.messages[0].readOn &&
                        convo.messages[0].toUser === user._id ? (
                          <Badge
                            className="badge-unread"
                            style={{ marginLeft: "0.5rem" }}
                          >
                            &nbsp;
                          </Badge>
                        ) : null}
                      </div>
                      {renderTitle(convo)}
                      <p
                        className={`p-0 m-0${
                          !convo.messages[0].readOn ? " fw-bold" : ""
                        }`}
                      >
                        {convo.messages[0].comment.length > 50
                          ? `${convo.messages[0].comment.substring(0, 50)}...`
                          : convo.messages[0].comment}
                      </p>
                    </Col>
                  </Row>
                );
              },
              onClick: () => history.push(`/messages/${convo.user._id}`),
            };
          })}
        />
      </>
    );
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
            {renderContent()}
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Messages;
