import React, { useGlobal, useDispatch, useState } from "reactn";
import { FormGroup, FormLabel, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import moment from "moment-timezone";
import Edit from "@material-ui/icons/Edit";

import SubInternalLayout from "../../layout/SubInternalLayout";
import ButtonList from "../../common/ButtonList";
import { useApiGet, useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { get } from "lodash";
import { TextLabel } from "../../common/labels";

const SkillsAndExperience = () => {
  const [user] = useGlobal("user");
  const [toggled, setToggled] = useState({
    education: get(user, "helper.profile.education", "") === "",
  });
  const history = useHistory();
  const updateUser = useDispatch("updateUser");

  const { isLoading: isServicesLoading, data: services } = useApiGet(
    "services",
    "/services"
  );

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    setToggled({ ...toggled, education: false });
  });

  const getServicesLabel = () => {
    if (isServicesLoading || !services) {
      return "Loading...";
    }

    const list = [];

    user.helper.servicesOffered.forEach((offered) => {
      const service = services.find((s) => offered.service === s._id);
      if (!service) {
        return;
      }
      list.push(service.name);
    });

    user.helper.specializedCare.forEach((s) => list.push(s));

    return list.join(", ").toLowerCase();
  };

  const getLicensesLabel = () => {
    if (
      !user.helper.profile ||
      !user.helper.profile.licenses ||
      user.helper.profile.licenses.length === 0
    ) {
      return "select your licenses";
    }

    return user.helper.profile.licenses
      .map((l) => l.title)
      .join(", ")
      .toLowerCase();
  };

  const getWorkExperienceLabel = () => {
    if (
      !user.helper.profile ||
      !user.helper.profile.workExperience ||
      user.helper.profile.workExperience.length === 0
    ) {
      return "enter your work experience";
    }

    return user.helper.profile.workExperience.map((work, i) => {
      return (
        <div key={i} className="mt-3">
          <h5 style={{ color: "#000", fontSize: "1.15rem" }}>
            {work.employer}, {work.title}
          </h5>
          <p>
            {moment.utc(work.startDate).format("MM/DD/YYYY")} -{" "}
            {work.currentJob
              ? "present"
              : moment.utc(work.endDate).format("MM/DD/YYYY")}
          </p>
        </div>
      );
    });
  };

  const toggleBtn = (key) => {
    if (toggled[key]) {
      return null;
    }

    return (
      <div className="float-end">
        <Button
          type="button"
          variant="link"
          onClick={() => setToggled({ ...toggled, [key]: true })}
        >
          <Edit />
        </Button>
      </div>
    );
  };

  return (
    <SubInternalLayout
      onBack={() => history.push("/profile/skill-experience")}
      alertMutate={save}
      title={`Skills & Experience`}
    >
      <ButtonList
        buttons={[
          {
            label: "Services I'll Provide",
            desc: getServicesLabel(),
            hasContent: true,
            onClick: () => history.push("/profile/skills-experience/services"),
          },
          {
            label: "Licenses",
            desc: getLicensesLabel(),
            hasContent: true,
            onClick: () => history.push("/profile/skills-experience/licenses"),
          },
          {
            label: "Languages",
            desc:
              user.helper.profile && user.helper.profile.languages
                ? user.helper.profile.languages.join(", ").toLowerCase()
                : "select your languages spoken",
            hasContent: true,
            onClick: () => history.push("/profile/skills-experience/languages"),
          },
          {
            label: "Work Experience",
            desc: getWorkExperienceLabel(),
            hasContent: true,
            onClick: () =>
              history.push("/profile/skills-experience/work-experience"),
          },
        ]}
      />

      <FormGroup className="mt-3 mb-5">
        {toggleBtn("education")}
        <FormLabel>Education</FormLabel>
        {!toggled.education ? (
          <TextLabel val={user.helper.profile.education} />
        ) : (
          <Form.Select
            value={
              user.helper.profile && user.helper.profile.education
                ? user.helper.profile.education
                : ""
            }
            onChange={(e) =>
              save.mutate({
                "helper.profile.education":
                  e.target.value !== "" ? e.target.value : null,
              })
            }
          >
            <option value="">Select your level of education</option>
            {[
              "High School",
              "GED",
              "Some college",
              "Bachelor's",
              "Master's",
              "PHD",
              "Other",
            ].map((level, i) => (
              <option key={i} value={level}>
                {level}
              </option>
            ))}
          </Form.Select>
        )}
        {save.isLoading ? (
          <small className="text-muted mb-0 mt-1">
            <SpinIcon /> Saving...
          </small>
        ) : null}
      </FormGroup>
    </SubInternalLayout>
  );
};

export default SkillsAndExperience;
