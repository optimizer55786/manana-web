import React, { useGlobal, useState, useEffect } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { useQueryClient } from "react-query";

import SubInternalLayout from "../layout/SubInternalLayout";
import { useFormData } from "../../hooks/useFormData";
import { useApiGet, useApiPost } from "../../hooks/useApi";
import SpinIcon from "../common/SpinIcon";
import Tabs from "../common/Tabs";
import HelperJobOverview from "./components/HelperJobOverview";
import ProfilePicture from "../common/ProfilePicture";
import { nl2br } from "../../lib/stringHelpers";

const Conversation = () => {
  const [user] = useGlobal("user");
  const [title, setTitle] = useState("Conversation");
  const { formData, hasChanged, onChange } = useFormData({
    newMessage: "",
  });
  const { conversationWith, jobId } = useParams();
  const history = useHistory();

  const queryClient = useQueryClient();
  const queryKey = `messagesWith${conversationWith}About${jobId}`;

  const { isLoading, data } = useApiGet(
    queryKey,
    `/communications/conversations/${conversationWith}/${jobId}`,
    { markAsRead: true },
    { staleTime: 5000 }
  );

  const save = useApiPost(`/communications/to/${conversationWith}`, (res) => {
    history.push("/messages", {
      alert: {
        msg: "Your message has been successfully sent.",
        variant: "success",
      },
    });
  });

  useEffect(() => {
    if (data) {
      setTitle(
        `${moment(data.messages[0].date).format("ddd, MMM D")} with ${
          data.user.name
        }`
      );
    }
  }, [data]);

  const renderMessages = () => {
    const messages = [...data.messages].reverse();
    const list = messages.map((msg, msgIndex) => {
      const convoWith = msg.fromUser === user._id ? user : data.user;

      return (
        <div
          key={msgIndex}
          className="field-list-item"
          style={{ padding: "1rem 0", marginBottom: "1rem" }}
        >
          <Row>
            <Col xs={12} sm={4} md={1}>
              <ProfilePicture user={convoWith} />
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

  const renderTabs = () => {
    if (!data.job) {
      return renderMessages();
    }

    return (
      <Tabs
        tabs={[
          {
            label: "Details",
            content: (
              <HelperJobOverview
                job={data.job}
                userProfile={data.user}
                onAccept={() => {
                  queryClient.invalidateQueries(queryKey);
                  history.push("/messages");
                }}
                onDecline={() => {
                  queryClient.invalidateQueries(queryKey);
                  history.push("/messages");
                }}
              />
            ),
          },
          { label: "Messages", content: renderMessages() },
        ]}
      />
    );
  };

  return (
    <SubInternalLayout
      alertMutate={save}
      title={title}
      onBack={() => history.push(`/messages/${conversationWith}`)}
    >
      {isLoading ? <p>Loading</p> : renderTabs()}

      <br />
      <br />
    </SubInternalLayout>
  );
};

export default Conversation;
