import React, { useGlobal } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import moment from "moment-timezone";

import SubInternalLayout from "../layout/SubInternalLayout";
import { useFormData } from "../../hooks/useFormData";
import { useApiGet, useApiPost } from "../../hooks/useApi";
import SpinIcon from "../common/SpinIcon";
import ProfilePicture from "../common/ProfilePicture";
import { nl2br } from "../../lib/stringHelpers";

const SystemConversation = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    newMessage: "",
  });
  const history = useHistory();

  const { isLoading, data } = useApiGet(
    "systemComm",
    `/communications/conversations/system`,
    { markAsRead: true },
    { staleTime: 5000 }
  );

  const save = useApiPost(`/communications/to/system`, (res) => {
    history.push("/messages", {
      alert: {
        msg: "Your message has been successfully sent.",
        variant: "success",
      },
    });
  });

  const renderMessages = () => {
    const list = data.messages.map((msg, msgIndex) => {
      const convoWith = msg.fromUser === user._id ? user : data.user;

      return (
        <div
          key={msgIndex}
          className="field-list-item"
          style={{ padding: "1rem 0", marginBottom: "1rem" }}
        >
          <Row>
            <Col xs={12} sm={4} md={1}>
              <ProfilePicture
                user={{ _id: "System", name: "Manana Support" }}
              />
            </Col>
            <Col xs={12} sm={8} md={11}>
              <div className="float-end">
                <p className="text-muted mb-0">
                  {moment(msg.date).format("MMM D").toUpperCase()}
                </p>
              </div>
              <h5>{convoWith.name}</h5>
              <p className="text-muted">{nl2br(msg.comment)}</p>
            </Col>
          </Row>
        </div>
      );
    });

    return (
      <>
        {list}
        <Form.Group>
          <Form.Control
            as="textarea"
            name="newMessage"
            placeholder="Type your reply"
            value={formData.newMessage}
            onChange={onChange}
            style={{ height: 125 }}
          />
        </Form.Group>

        <div className="text-end mt-3">
          <Button
            type="button"
            onClick={() =>
              save.mutate({
                email: formData.email,
                "helper.jobTypes": formData.jobTypes,
                "helper.availableOvernight": formData.overnight,
              })
            }
            disabled={!hasChanged || save.isLoading}
            style={{ minWidth: 180, fontWeight: 700 }}
          >
            {save.isLoading ? <SpinIcon /> : "SEND"}
          </Button>
        </div>
      </>
    );
  };

  return (
    <SubInternalLayout
      alertMutate={save}
      title="Manana Support"
      onBack={() => history.push(`/messages`)}
    >
      {isLoading ? <p>Loading</p> : renderMessages()}

      <br />
      <br />
    </SubInternalLayout>
  );
};

export default SystemConversation;
