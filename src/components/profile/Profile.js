import React, { useGlobal, useState, useEffect, useDispatch } from "reactn";
import { useHistory, useParams } from "react-router-dom";
import { Container, Row, Col, Button, Alert } from "react-bootstrap";
import get from "lodash.get";

import InternalLayout from "../layout/InternalLayout";
import ButtonList from "../common/ButtonList";
import UploadButton from "../common/UploadButton";
import { useApiGet, useApiPut } from "../../hooks/useApi";
import { useProfile } from "../../hooks/useProfile";

const Profile = () => {
  const [user] = useGlobal("user");
  const [error] = useState(null);
  const history = useHistory();
  const { profileId } = useParams();
  const profile = useProfile(profileId);

  const updateUser = useDispatch("updateUser");

  // this is just a call to pre-cache the services list
  useApiGet("services", "/services", null, {
    staleTime: 300000,
  });

  const updateProfile = useApiPut(
    "/users/profile",
    (res) => {
      updateUser(res);
    },
    {
      onError: (err) => {
        alert(err.message);
      },
    }
  );

  useEffect(() => {
    if (user.customer && !profileId) {
      history.push(`/profile/${user.customer.profiles[0]._id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]);

  const hasContent = (fields) => {
    if (!Array.isArray(fields) || fields.length === 0) {
      return false;
    }

    let hasVal = false;
    const obj = user.helper ? user.helper : profile;

    fields.forEach((f) => {
      const v = get(obj, f, null);
      if (v !== null) {
        hasVal = true;
      }
    });

    return hasVal;
  };

  const links = user.helper
    ? [
        {
          label: "Personal information",
          hasContent: true,
          onClick: () => history.push("/profile/personal-information"),
        },
        {
          label: "Skills and experience",
          hasContent: true,
          onClick: () => history.push("/profile/skills-experience"),
        },
        {
          label: "About me",
          hasContent: hasContent(["profile.description"]),
          onClick: () => history.push("/profile/about-me"),
        },
        {
          label: "Reviews",
          hasContent: true,
          onClick: () => history.push(`/profile/reviews`),
        },
      ]
    : [
        {
          label: "About Me",
          hasContent: hasContent(["description"]),
          onClick: () => history.push(`/profile/${profileId}/about-me`),
        },
        {
          label: "Personal information",
          hasContent: true,
          onClick: () =>
            history.push(`/profile/${profileId}/personal-information`),
        },
        {
          label: "Emergency Contacts",
          hasContent: hasContent(["emergencyContacts"]),
          onClick: () =>
            history.push(`/profile/${profileId}/emergency-contacts`),
        },
        {
          label: "Health Information",
          hasContent: hasContent(["healthInformation"]),
          onClick: () =>
            history.push(`/profile/${profileId}/health-information`),
        },
        {
          label: "Reviews",
          hasContent: true,
          onClick: () => history.push(`/profile/${profileId}/reviews`),
        },
      ];

  if (user.customer && !profile) {
    return <p>Redirecting...</p>;
  }

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
            <h2 className="mb-3">Profile</h2>

            <Row>
              <Col xs={12} sm={3}>
                {profile.profilePicture ? (
                  <img
                    src={profile.profilePicture}
                    alt={profile.name}
                    className="profile-photo"
                  />
                ) : (
                  <div className="profile-photo"></div>
                )}
                <UploadButton
                  btnLabel="Add Photo"
                  className="profile-photo-btn"
                  onUpload={(url) => {
                    const payload = {};

                    if (user.helper) {
                      payload["helper.profile.profilePicture"] = url;
                    } else {
                      payload["customer.profiles"] = [
                        ...user.customer.profiles,
                      ];

                      // get the profile currently selected by id
                      const p = payload["customer.profiles"].find(
                        (pro) => pro._id === profile._id
                      );

                      // update the record from the spread above
                      p.profilePicture = url;
                    }

                    updateProfile.mutate(payload);
                  }}
                />
              </Col>
              <Col xs={12} sm={9}>
                <h2 style={{ marginTop: 75 }}>
                  {user.customer ? profile.name : user.name}
                </h2>
              </Col>
            </Row>

            <ButtonList className="mt-5 mb-5" buttons={links} />
          </Col>
        </Row>
      </Container>
    </InternalLayout>
  );
};

export default Profile;
