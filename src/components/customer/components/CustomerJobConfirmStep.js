import React, { useGlobal, useEffect } from "reactn";
import PropTypes from "prop-types";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  FormGroup,
  FormCheck,
  FormControl,
  FormSelect,
} from "react-bootstrap";
import moment from "moment-timezone";
import ArrowBack from "@material-ui/icons/ArrowBack";
import Texture from "@material-ui/icons/Texture";
import CalendarToday from "@material-ui/icons/CalendarToday";
import Edit from "@material-ui/icons/Edit";
import AccessTime from "@material-ui/icons/AccessTime";
import InfoOutlined from "@material-ui/icons/InfoOutlined";

import ButtonList from "../../common/ButtonList";
import ProfilePicture from "../../common/ProfilePicture";
import StarRating from "../../common/StarRating";

import { getUserRateFromJobRequest } from "../../../lib/jobRequestHelpers";
import { useFormData } from "../../../hooks/useFormData";
import { useApiGet, useApiPost } from "../../../hooks/useApi";

const CustomerJobConfirmStep = ({ onComplete, onBack }) => {
  const [user] = useGlobal("user");
  const [jobRequest] = useGlobal("jobRequest");
  const { formData, onChange } = useFormData({
    helpers: jobRequest.requestedHelpers || [],
    requestFor: jobRequest.requestFor || user.customer.profiles[0]._id,
    additionalNotes: "",
    requestCallBefore: false,
  });
  const history = useHistory();

  const startDate = moment.utc(jobRequest.dates.startDate);
  const endTime = jobRequest.dates.endTime.split(":");
  const endDate = moment(startDate).set({
    hour: parseInt(endTime[0]),
    minute: parseInt(endTime[1]),
  });

  const { isLoading: isLoadingHelpers, data: helpers } = useApiGet(
    "pickedHelpers",
    "/helpers/profiles",
    { helperIds: jobRequest.requestedHelpers }
  );

  const { isLoading: isLoadingServices, data: services } = useApiGet(
    "services",
    "/services"
  );

  const apiSubmit = useApiPost("/job-requests", (resp) => {
    onComplete(resp);
  });

  const onSubmit = (e) => {
    e.preventDefault();

    // prepare the payload by combining the existing job request and the updates
    const payload = {
      ...jobRequest,
      requestedHelpers: formData.helpers,
      requestFor: formData.requestFor,
      additionalNotes: formData.additionalNotes,
      requestCallBefore: formData.requestCallBefore,
    };

    apiSubmit.mutate(payload);
  };

  const renderSelectedUsers = () => {
    if (isLoadingHelpers) {
      return <p>Loading helpers...</p>;
    }

    return helpers.map((user, userIndex) => {
      const rating = user.helper._rating || { score: 0, count: 0 };
      const rate = getUserRateFromJobRequest(user, jobRequest);

      return (
        <div
          key={userIndex}
          className="mt-4 mb-4 pb-4"
          style={{ borderBottom: "1px solid var(--border-color)" }}
        >
          <Row>
            <Col xs={2}>
              <ProfilePicture user={user} />{" "}
            </Col>
            <Col>
              <h5>{user.name}</h5>
              <StarRating rating={rating.score} totalRatings={rating.count} />
            </Col>
            <Col xs={3} className="text-end">
              <h5>{!rate ? "Not Available" : `$${rate * jobRequest.hours}`}</h5>
              <p className="text-muted">TOTAL COST</p>
            </Col>
            <Col xs={1} className="text-end">
              <InfoOutlined />
            </Col>
          </Row>
        </div>
      );
    });
  };

  const renderServicesList = () => {
    if (isLoadingServices) {
      return "Loading...";
    }

    const list = [];

    jobRequest.servicesRequested.forEach((rs) => {
      const service = services.find((s) => s._id === rs.service);
      if (service) {
        list.push(service.name);
      }
    });

    return [...list, ...jobRequest.specializedCare].join(", ");
  };

  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => onBack()}
        style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
      >
        <ArrowBack />
      </Button>
      <form onSubmit={onSubmit} style={{ position: "relative" }}>
        <h2 className="mb-3">Help request</h2>

        <FormGroup className="mb-4">
          <h3>Who is this help for?</h3>
          <FormSelect
            name="requestFor"
            value={formData.requestFor}
            onChange={onChange}
          >
            {user.customer.profiles
              ? user.customer.profiles.map((p, i) => {
                  return (
                    <option key={i} value={p._id}>
                      {p.name}
                    </option>
                  );
                })
              : null}
          </FormSelect>
        </FormGroup>

        <ButtonList
          buttons={[
            {
              render: () => {
                return (
                  <Row>
                    <Col xs={1}>
                      <CalendarToday />
                    </Col>
                    <Col xs={10}>
                      <h5>{startDate.format("ddd, MMM D")}</h5>
                      <p className="text-muted m-0">
                        Between {startDate.format("h:mm A")} and{" "}
                        {endDate.format("h:mm A")}
                      </p>
                    </Col>
                    <Col xs={1}>
                      <Edit />
                    </Col>
                  </Row>
                );
              },
              onClick: () => {
                alert("TEST");
              },
            },
            {
              render: () => {
                return (
                  <Row>
                    <Col xs={1}>
                      <AccessTime />
                    </Col>
                    <Col xs={10}>
                      <h5>Duration</h5>
                      <p className="text-muted m-0">
                        {jobRequest.hours} hour
                        {jobRequest.hours === 1 ? "" : "s"}
                      </p>
                    </Col>
                    <Col xs={1}>
                      <Edit />
                    </Col>
                  </Row>
                );
              },
              onClick: () => {
                alert("TEST");
              },
            },
            {
              render: () => {
                return (
                  <Row>
                    <Col xs={1}>
                      <Texture />
                    </Col>
                    <Col xs={10}>
                      <h5>Help requested</h5>
                      <p className="text-muted m-0">{renderServicesList()}</p>
                    </Col>
                    <Col xs={1}>
                      <Edit />
                    </Col>
                  </Row>
                );
              },
              onClick: () => {
                alert("TEST");
              },
            },
          ]}
        />
        <br />

        <div className="float-end">
          <Button
            type="button"
            variant="link"
            style={{ margin: 0, padding: 0, color: "#000" }}
          >
            <Edit />
          </Button>
        </div>
        <h3>Selected Helpers</h3>
        {renderSelectedUsers()}

        <br />

        <FormGroup className="mb-4">
          <FormControl
            as="textarea"
            name="additionalNotes"
            placeholder="Additional Notes"
            onChange={onChange}
            value={formData.additionalNotes}
            style={{ minHeight: 125 }}
          />
        </FormGroup>

        <FormGroup>
          <FormCheck
            id="cb-requestCallBefore"
            type="checkbox"
            label="I'd like to schedule a call with helper prior to confirming booking."
            checked={formData.requestCallBefore}
            onChange={(e) =>
              onChange({
                target: { name: "requestCallBefore", value: e.target.checked },
              })
            }
          />
        </FormGroup>

        <br />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-100"
          disabled={apiSubmit.isLoading}
        >
          {apiSubmit.isLoading ? "..." : "SEND REQUEST"}
        </Button>

        <hr />

        <Button
          variant="link"
          size="lg"
          className="w-100 m-0 p-0"
          onClick={() => {
            window.localStorage.removeItem("jobRequest");
            history.push("/dashboard");
          }}
        >
          CANCEL REQUEST
        </Button>
      </form>
    </>
  );
};

CustomerJobConfirmStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default CustomerJobConfirmStep;
