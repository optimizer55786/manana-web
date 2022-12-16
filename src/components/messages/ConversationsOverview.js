import React, { useState, useEffect, useGlobal } from "reactn";
import { useLocation, useParams, useHistory } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Button,
  Alert,
  Badge,
  Form,
} from "react-bootstrap";
import moment from "moment-timezone";

import ArrowBack from "@material-ui/icons/ArrowBack";
import ChevronRight from "@material-ui/icons/ChevronRight";

import InternalLayout from "../layout/InternalLayout";
import Tabs from "../common/Tabs";
import ButtonList from "../common/ButtonList";
import ProfilePicture from "../common/ProfilePicture";
import StarRating from "../common/StarRating";
import { useApiGet, useApiPost } from "../../hooks/useApi";
import { getMessageTitle } from "../../lib/jobRequestHelpers";
import { useFormData } from "../../hooks/useFormData";

const ConversationsOverview = () => {
  const [user] = useGlobal("user");
  const [activeList, setActiveList] = useState([]);
  const [archivedList, setArchivedList] = useState([]);
  const { formData, onChange, setData } = useFormData({
    job: null,
    toUser: null,
    comment: "",
  });
  const { conversationWith } = useParams();
  const history = useHistory();
  const { isLoading, data } = useApiGet(
    `messagesWith${conversationWith}`,
    `/communications/conversations/${conversationWith}`,
    null,
    {
      staleTime: 5000,
    }
  );

  useEffect(() => {
    if (data) {
      // we need to group messages by their job association
      let jobs = {};

      data.messages.forEach((msg) => {
        const jobId = msg.job ? msg.job._id : "system";

        if (!jobs[jobId]) {
          jobs[jobId] = { job: msg.job || null, messages: [] };
        }

        let m = { ...msg };
        delete m.job;

        jobs[jobId].messages.push(m);
      });

      jobs = Object.values(jobs);

      const active = [];
      const archived = [];

      jobs.forEach((j) => {
        if (
          !j.job ||
          (!j.job.endedOn &&
            !j.job.declinedBy.includes(user._id) &&
            (!j.job.helper || j.job.helper === user._id))
        ) {
          active.push(j);
        } else {
          archived.push(j);
        }
      });

      setActiveList(active);
      setArchivedList(archived);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const renderShortForm = () => {
    return (
      <div>
        <Form.Control
          as="textarea"
          name="comment"
          value={formData.comment}
          onChange={onChange}
          placeholder="Type your reply"
          autoFocus={true}
          style={{ height: 125, marginBottom: "1rem" }}
        />
        <Row>
          <Col>
            <Button
              variant="link"
              className="m-0 p-0"
              style={{ fontWeight: 700, textDecoration: "none" }}
              onClick={(e) => {
                e.stopPropagation();
                setData({ job: null });
              }}
            >
              CANCEL
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              variant="primary"
              style={{ fontWeight: 700, minWidth: 180 }}
              onClick={(e) => {
                e.stopPropagation();
                alert("SUBMIT");
              }}
            >
              SEND
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  const renderList = (list) => {
    if (!list || list.length === 0) {
      return <p className="text-center lead text-muted">List is empty.</p>;
    }

    return (
      <ButtonList
        hover={true}
        buttons={list.map((job) => {
          return {
            render: () => {
              return (
                <div>
                  <p
                    className="text-end text-muted pb-0 mb-2"
                    style={{ fontWeight: 500 }}
                  >
                    {moment(job.messages[0].date)
                      .format("MMM. D")
                      .toUpperCase()}
                  </p>
                  <div className="float-end">
                    {job.messages[0].toUser === user._id &&
                    !job.messages[0].readOn ? (
                      <Badge className="badge-unread">&nbsp;</Badge>
                    ) : null}
                    <ChevronRight />
                  </div>
                  <h5>{getMessageTitle(job.messages[0], data.user, user)}</h5>
                  <p className="text-muted">{job.messages[0].comment}</p>
                  {formData.job === job._id ? (
                    renderShortForm()
                  ) : (
                    <div>
                      <Button
                        variant="link"
                        className="m-0 p-0"
                        style={{
                          fontWeight: 700,
                          textDecoration: "none",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setData({
                            job: job._id,
                            comment: "",
                          });
                        }}
                      >
                        REPLY
                      </Button>
                    </div>
                  )}
                </div>
              );
            },
            onClick: () =>
              history.push(
                `/messages/${conversationWith}/${
                  !job.job ? "system" : job.job._id
                }#messages`
              ),
          };
        })}
        styles={{ borderTop: "none" }}
      />
    );
  };

  return (
    <InternalLayout>
      <Container>
        <Row>
          <Col xs={12} sm={12} md={{ span: 8, offset: 2 }}>
            {isLoading ? (
              <h3>Loading...</h3>
            ) : (
              <>
                <Button
                  type="button"
                  variant="link"
                  onClick={() => history.push("/messages")}
                  style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
                >
                  <ArrowBack />
                </Button>

                <div className="mb-5">
                  <Row>
                    <Col xs={2}>
                      <ProfilePicture size="md" user={data.user} />
                    </Col>
                    <Col>
                      <h3>{data.user.name}</h3>
                      <StarRating
                        rating={
                          data.user._ratings ? data.user._ratings.score : 0
                        }
                        totalRatings={
                          data.user._ratings ? data.user._ratings.count : 0
                        }
                      />
                    </Col>
                  </Row>
                </div>

                <Tabs
                  tabs={[
                    {
                      label: "ACTIVE",
                      content: renderList(activeList),
                    },
                    {
                      label: "ARCHIVED",
                      content: renderList(archivedList),
                    },
                  ]}
                />
                <br />
              </>
            )}
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default ConversationsOverview;
