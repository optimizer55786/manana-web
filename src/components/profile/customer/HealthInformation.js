import React from "reactn";
import { useHistory, useParams } from "react-router-dom";

import SubInternalLayout from "../../layout/SubInternalLayout";
import ButtonList from "../../common/ButtonList";
import { useProfile } from "../../../hooks/useProfile";

const HealthInformation = () => {
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const history = useHistory();

  return (
    <SubInternalLayout title="Health Information">
      <ButtonList
        className="mt-5 mb-5"
        buttons={[
          {
            label: "Help Needed For Daily Care",
            hasContent:
              profile.healthInformation && profile.healthInformation.dailyCare,
            onClick: () =>
              history.push(
                `/profile/${profileId}/health-information/daily-care`
              ),
          },
          {
            label: <>Health Conditions &amp; Diseases</>,
            hasContent:
              profile.healthInformation &&
              profile.healthInformation.healthConditions &&
              (profile.healthInformation.healthConditions.conditions.length >
                0 ||
                profile.healthInformation.healthConditions.notes),
            onClick: () =>
              history.push(
                `/profile/${profileId}/health-information/health-conditions-diseases`
              ),
          },
          {
            label: "Medications",
            hasContent:
              profile.healthInformation &&
              profile.healthInformation.medications &&
              profile.healthInformation.medications.length > 0,
            onClick: () =>
              history.push(
                `/profile/${profileId}/health-information/medications`
              ),
          },
          {
            label: "Healthcare Providers",
            hasContent:
              profile.healthInformation &&
              profile.healthInformation.providers &&
              profile.healthInformation.providers.length > 0,
            onClick: () =>
              history.push(
                `/profile/${profileId}/health-information/healthcare-providers`
              ),
          },
        ]}
      />
    </SubInternalLayout>
  );
};

export default HealthInformation;
