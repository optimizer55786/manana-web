import React from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Button } from "react-bootstrap";

import ProfilePicture from "../common/ProfilePicture";
import StarRating from "../common/StarRating";

const HelperShortProfile = ({ profile, onSelect }) => {
  return (
    <div
      className="helper-profile mb-4"
      style={{
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "1rem",
      }}
    >
      <Row>
        <Col xs={2}>
          <ProfilePicture user={{ profile }} />
        </Col>
        <Col>
          <h5 className="mb-1">
            <Button
              variant="link"
              className="m-0 p-0"
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                textDecoration: "none",
              }}
              onClick={() => onSelect()}
            >
              {profile.name}
            </Button>
          </h5>
          <div className="mb-1">
            <StarRating rating={4.5} totalRatings={4} />
          </div>
          <p className="text-muted m-0">available starting Jan 4</p>
        </Col>
        <Col xs={3}>
          <div className="text-end">
            <h5>${profile.hourlyRates.standard}</h5>
            <p className="text-muted m-0">per hour</p>
          </div>
        </Col>
      </Row>
    </div>
  );
};

HelperShortProfile.propTypes = {
  profile: PropTypes.object.isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default HelperShortProfile;
