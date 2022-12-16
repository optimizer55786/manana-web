import React, { useGlobal } from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Form, Button } from "react-bootstrap";
import moment from "moment-timezone";

import CalendarToday from "@material-ui/icons/CalendarToday";
import Schedule from "@material-ui/icons/Schedule";
import Texture from "@material-ui/icons/Texture";
import AttachMoney from "@material-ui/icons/AttachMoney";

import ProfilePicture from "./ProfilePicture";
import StarRating from "./StarRating";
import { useApiGet } from "../../hooks/useApi";
import { useFormData } from "../../hooks/useFormData";
import { getUserRateFromJobRequest } from "../../lib/jobRequestHelpers";
import { ucwords } from "../../lib/stringHelpers";

import "./css/JobOverview.css";

const JobOverview = ({ job, userProfile }) => {
  const [user] = useGlobal("user");
  const { formData, onChange } = useFormData({ response: "" });
  const startDt = moment.utc(job.dates.startDateTime);
  const endDt = moment(startDt).set({
    hour: job.dates.endTime.split(":")[0],
    minutes: job.dates.endTime.split(":")[1],
  });

  const { isLoading: isServicesLoading, data: services } = useApiGet(
    "services",
    "/services"
  );

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

  return (
    <div className="job-overview">
      <div className="profile">
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
            <strong>{startDt.format("ddd, MMM D")}</strong>
            <p className="text-muted">
              Starts between {startDt.format("h:mm A")} and{" "}
              {endDt.format("h:mm A")}
            </p>
          </Col>
        </Row>
      </div>
      <div className="duration">
        <Row>
          <Col xs={4} sm={3} md={1}>
            <Schedule />
          </Col>
          <Col>
            <strong>Duration</strong>
            <p className="text-muted">{job.hours} hours of help</p>
          </Col>
        </Row>
      </div>
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
      {job.helper === null || job.helper === user._id ? (
        <div className="actions">
          <h5 className="mb-4">
            Let your help recipient know when you'll arrive.
          </h5>

          <Form.Control
            as="textarea"
            name="response"
            placeholder="Send a response with your reply..."
            maxLength={250}
            value={formData.response}
            onChange={onChange}
          />
          <p className="text-end text-muted">
            {formData.response.length} / 250 CHAR MAX
          </p>

          <Button variant="primary">ACCEPT REQUEST</Button>
          <Button variant="link">DENY REQUEST</Button>
        </div>
      ) : null}
    </div>
  );
};

JobOverview.propTypes = {
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
};

export default JobOverview;
