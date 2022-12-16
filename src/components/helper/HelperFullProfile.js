import React from "reactn";
import PropTypes from "prop-types";
import { Row, Col, Badge } from "react-bootstrap";
import moment from "moment-timezone";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";

import ProfilePicture from "../common/ProfilePicture";
import StarRating from "../common/StarRating";
import Tabs from "../common/Tabs";

const HelperFullProfile = ({ user }) => {
  const profile = user.profile;

  return (
    <div
      className="helper-profile mb-4"
      style={{
        borderBottom: "1px solid var(--border-color)",
        paddingBottom: "1rem",
      }}
    >
      <Row>
        <Col xs={3}>
          <ProfilePicture user={user} size="md" />
        </Col>
        <Col>
          <div className="float-end">
            <FavoriteBorder />
          </div>
          <h3 className="mb-1">{user.name}</h3>
          <div className="mb-2">
            <StarRating rating={4.5} totalRatings={4} />
          </div>
          {profile && profile.licenses && profile.licenses.length > 0
            ? profile.licenses.map((l, lIndex) => {
                let matches = /\s\((.*)\)$/.exec(l.title);
                const abbr = matches ? matches[1] : l.title;
                return (
                  <Badge key={lIndex} bg="secondary" className="mr-1">
                    {abbr}
                  </Badge>
                );
              })
            : null}
        </Col>
      </Row>
      <br />

      <Tabs
        tabs={[
          {
            label: "PROFILE",
            content: (
              <div>
                <h3 className="mb-3">Profile</h3>
                <h5>About me</h5>
                <p className="text-muted">
                  {profile.description ||
                    "Helper has not added any about me information."}
                </p>
                <div className="divider" />
                <h5>Languages</h5>
                <p className="text-muted">
                  {profile.languages
                    ? profile.languages.join(", ")
                    : "Not Available"}
                </p>
                <div className="divider" />
                <h5>Age</h5>
                <p className="text-muted">
                  {profile.dateOfBirth
                    ? moment
                        .utc()
                        .diff(moment.utc(profile.dateOfBirth), "years")
                    : "Not Available"}
                </p>
                <div className="divider" />
                <h5>Gender</h5>
                <p className="text-muted">
                  {profile.gender || "Not Available"}
                </p>
              </div>
            ),
          },
          {
            label: "EXPERIENCE",
            content: (
              <div>
                <h3 className="mb-3">Experience</h3>
                <pre>
                  {JSON.stringify(profile.workExperience || null, undefined, 2)}
                </pre>
              </div>
            ),
          },
          {
            label: "REVIEWS",
            content: (
              <div>
                <h3 className="mb-3">Reviews</h3>
                <pre>
                  {JSON.stringify(profile.reviews || null, undefined, 2)}
                </pre>
              </div>
            ),
          },
          {
            label: "AVAILABILITY",
            content: (
              <div>
                <h3 className="mb-3">Availability</h3>
                <pre>{JSON.stringify(profile, undefined, 2)}</pre>
              </div>
            ),
          },
        ]}
        enableLocation={false}
        justifyLinks={true}
      />
    </div>
  );
};

HelperFullProfile.propTypes = {
  user: PropTypes.object.isRequired,
};

export default HelperFullProfile;
