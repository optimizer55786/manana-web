import React, { useGlobal, useState } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";
import moment from "moment-timezone";

import CalendarToday from "@material-ui/icons/CalendarToday";
import Texture from "@material-ui/icons/Texture";
import AttachMoney from "@material-ui/icons/AttachMoney";
import Remove from "@material-ui/icons/Remove";
import AccessTime from "@material-ui/icons/AccessTime";
import Edit from "@material-ui/icons/Edit";

import ProfilePicture from "../../common/ProfilePicture";
import StarRating from "../../common/StarRating";
import { useApiGet, useApiPut } from "../../../hooks/useApi";
import { useFormData } from "../../../hooks/useFormData";
import {
  getUserRateFromJobRequest,
  getIsOpen,
  getNotOpenReason,
} from "../../../lib/jobRequestHelpers";
import { ucwords } from "../../../lib/stringHelpers";

import "../../common/css/JobOverview.css";

const HelperJobOverview = ({ job, userProfile, onAccept, onDecline }) => {
  const [user] = useGlobal("user");
  const [isOpen, setIsOpen] = useState(getIsOpen(job, user));
  const startDt = moment.utc(job.dates.startDateTime);
  const endDt = moment(startDt).set({
    hour: job.dates.endTime.split(":")[0],
    minutes: job.dates.endTime.split(":")[1],
  });
  const [toggleTime, setToggleTime] = useState(false);
  const { formData, onChange, setData } = useFormData({
    arrivalTime: startDt.format("HH:mm"),
    arrivalDateTime: job.dates.arrivalDateTime || null,
    notes: "",
  });

  const { isLoading: isServicesLoading, data: services } = useApiGet(
    "services",
    "/services"
  );

  const apiJobUpdate = useApiPut(`/job-requests/${job._id}`);
  const apiJobAccept = useApiPut(`/job-requests/${job._id}/accept`, (resp) => {
    if (onAccept) {
      setToggleTime(false);
      onAccept(resp);
    }
  });
  const apiJobDecline = useApiPut(
    `/job-requests/${job._id}/decline`,
    (resp) => {
      setIsOpen(false);
      if (onDecline) {
        onDecline(resp);
      }
    }
  );

  const isBusy = () => {
    return (
      isServicesLoading ||
      apiJobUpdate.isLoading ||
      apiJobAccept.isLoading ||
      apiJobDecline.isLoading
    );
  };

  const getServicesLabel = () => {
    if (isServicesLoading || !services) {
      return "Loading...";
    }

    const list = [];

    job.servicesRequested.forEach((offered) => {
      const service = services.find((s) => offered.service === s._id);
      if (!service) {
        return;
      }
      list.push(service.name);
    });

    return list.join(", ").toLowerCase();
  };

  const getPayout = () => {
    const helper = user.helper || userProfile.helper;
    const rate = getUserRateFromJobRequest({ helper }, job);

    return `$${rate * job.hours}`;
  };

  const getStarRating = () => {
    const profile = userProfile.helper || userProfile.customer;
    const ratings = profile._ratings || { score: 0, count: 0 };
    return <StarRating rating={ratings.score} totalRatings={ratings.count} />;
  };

  const renderStartTime = () => {
    const dt = moment(startDt);
    const timeBlocks = endDt.diff(dt, "hours") * 4;
    const opts = [];

    for (let i = 0; i <= timeBlocks; i++) {
      if (i > 0) {
        dt.add(15, "minutes");
      }
      opts.push(
        <option key={i} value={dt.format("HH:mm")}>
          {dt.format("h:mm A")}
        </option>
      );
    }

    return (
      <Form.Select
        name="arrivalTime"
        onChange={onChange}
        value={formData.arrivalTime}
      >
        {opts}
      </Form.Select>
    );
  };

  const renderEndTime = () => {
    const time = formData.arrivalTime.split(":");
    const dt = moment(startDt)
      .set({ hours: time[0], minutes: time[1] })
      .add(job.hours, "hours");
    return <h5 className="text-muted mt-1">{dt.format("h:mm A")}</h5>;
  };

  const renderArrivalTime = () => {
    if (!isOpen) {
      return null;
    }

    if (toggleTime) {
      return (
        <div>
          <Row>
            <Col xs={5}>{renderStartTime()}</Col>
            <Col className="text-center pt-1">
              <strong>
                <Remove />
              </strong>
            </Col>
            <Col xs={5}>{renderEndTime()}</Col>
          </Row>
          <br />
          <Button
            variant="primary"
            className="w-100"
            disabled={isBusy()}
            onClick={() => {
              const time = formData.arrivalTime.split(":");
              const dt = moment(startDt).set({
                hours: time[0],
                minutes: time[1],
              });
              onChange({
                target: { name: "arrivalDateTime", value: dt.toDate() },
              });
              setToggleTime(false);
            }}
          >
            SAVE
          </Button>
          <Button
            variant="link"
            className="w-100"
            onClick={() => {
              setData({ arrivalTime: "", arrivalDateTime: null });
              setToggleTime(false);
            }}
            disabled={isBusy()}
          >
            CANCEL
          </Button>
        </div>
      );
    }

    return (
      <Button
        variant="primary"
        className="w-100"
        onClick={() => setToggleTime(true)}
        disabled={isBusy()}
      >
        SET ARRIVAL TIME
      </Button>
    );
  };

  const renderTimeframe = () => {
    const arrivalDt = moment.utc(formData.arrivalDateTime);
    return (
      <p className="text-muted mb-4">
        {arrivalDt.format("h:mm A")} -{" "}
        {arrivalDt.add(job.hours, "hours").format("h:mm A")}
      </p>
    );
  };

  return (
    <div className="job-overview">
      <div className="profile">
        {!isOpen ? (
          <Alert variant="danger" className="text-center mb-4">
            {getNotOpenReason(job, user)}
          </Alert>
        ) : null}
        <Row>
          <Col xs={3}>
            <ProfilePicture user={userProfile} size="md" />
          </Col>
          <Col>
            <h3>{userProfile.name}</h3>
            {getStarRating()}
          </Col>
        </Row>
      </div>
      <div className="schedule">
        <Row>
          <Col xs={4} sm={3} md={1}>
            <CalendarToday />
          </Col>
          <Col>
            {formData.arrivalDateTime ? (
              <>
                {!job.acceptedOn ? (
                  <div className="float-end">
                    <Button
                      variant="link"
                      className="pt-0 pb-0 mt-0 mb-0"
                      onClick={() => setToggleTime(true)}
                    >
                      <Edit />
                    </Button>
                  </div>
                ) : null}
                <strong>{startDt.format("ddd, MMM D")}</strong>
                {renderTimeframe()}
              </>
            ) : (
              <>
                <strong>{startDt.format("ddd, MMM D")}</strong>
                <p className="text-muted mb-4">
                  {job.hours} hours of help
                  <br />
                  between {startDt.format("h:mm A")} and{" "}
                  {endDt.format("h:mm A")}
                </p>
                {renderArrivalTime()}
              </>
            )}
          </Col>
        </Row>
      </div>
      {formData.arrivalDateTime ? (
        <div className="duration">
          <Row>
            <Col xs={4} sm={3} md={1}>
              <AccessTime />
            </Col>
            <Col>
              <strong>Duration</strong>
              <p className="text-muted mb-4">{job.hours} hours of help</p>
            </Col>
          </Row>
        </div>
      ) : null}
      <div className="help-requested">
        <Row>
          <Col xs={4} sm={3} md={1}>
            <Texture />
          </Col>
          <Col>
            <strong>Help requested</strong>
            <p className="text-muted">{ucwords(getServicesLabel())}</p>
          </Col>
        </Row>
      </div>
      <div className="notes">
        <Row>
          <Col xs={4} sm={3} md={1}>
            <Texture />
          </Col>
          <Col>
            <strong>Notes</strong>
            <p className="text-muted">{job.additionalNotes || "-"}</p>
          </Col>
        </Row>
      </div>
      <div className="payout">
        <Row>
          <Col xs={4} sm={3} md={1}>
            <AttachMoney />
          </Col>
          <Col>
            <p
              className="float-end"
              style={{ fontWeight: 600, fontSize: "1.25rem" }}
            >
              {getPayout()}
            </p>
            <strong>Payout</strong>
          </Col>
        </Row>
      </div>
      {isOpen ? (
        <div className="actions">
          {!job.acceptedOn ? (
            <>
              <Form.Group>
                <Form.Label>
                  Let your help recipient know when you'll arrive.
                </Form.Label>
                <Form.Control
                  as="textarea"
                  name="notes"
                  value={formData.notes}
                  onChange={onChange}
                  placeholder="Additional notes or comments..."
                  maxLength={250}
                />
                <p className="text-muted text-end">
                  {formData.notes.length} / 250 CHAR MAX
                </p>
              </Form.Group>
              <Button
                variant="primary"
                onClick={() => {
                  apiJobAccept.mutate({
                    "dates.arrivalDateTime": formData.arrivalDateTime,
                    notes: formData.notes,
                  });
                }}
                disabled={formData.arrivalDateTime === null}
              >
                ACCEPT REQUEST
              </Button>
            </>
          ) : (
            <Button
              variant="primary"
              onClick={() => {
                alert("TRIGGER FINISHED");
              }}
              disabled={true}
            >
              FINISHED
            </Button>
          )}
          <Button
            variant="link"
            onClick={() => {
              setToggleTime(false);
              apiJobDecline.mutate({});
            }}
            disabled={isBusy()}
          >
            {job.helper === user._id ? "CANCEL BOOKING" : "DENY REQUEST"}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

HelperJobOverview.propTypes = {
  job: PropTypes.objectOf(
    PropTypes.shape({ _id: PropTypes.string.isRequired })
  ),
  userProfile: PropTypes.objectOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      _ratings: PropTypes.objectOf(
        PropTypes.shape({
          rating: PropTypes.number.isRequired,
          count: PropTypes.number.isRequired,
        })
      ).isRequired,
    })
  ),
  onAccept: PropTypes.func,
  onDecline: PropTypes.func,
};

export default HelperJobOverview;
