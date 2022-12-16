import React, { useDispatch } from "reactn";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import get from "lodash.get";
import Close from "@material-ui/icons/Close";

import SubInternalLayout from "../../../layout/SubInternalLayout";
import { useFormData } from "../../../../hooks/useFormData";
import { useApiPut } from "../../../../hooks/useApi";
import { useProfile } from "../../../../hooks/useProfile";
import { getProfileUpdatePayload } from "../../../../lib/profileHelpers";

import HealthConditionsSelect from "./HealthConditionsSelect";

const HealthConditions = () => {
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const history = useHistory();
  const { formData, onChange, hasChanged } = useFormData({
    conditions:
      profile.healthInformation && profile.healthInformation.healthConditions
        ? profile.healthInformation.healthConditions.conditions.map((c) => {
            return { value: c, label: c };
          })
        : [],
    notes: get(profile, "healthInformation.healthConditions.notes", ""),
  });

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push(`/profile/${profileId}/health-information`, {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const healthInformation = profile.healthInformation || {};
    const conditions = formData.conditions
      ? formData.conditions.map((c) => c.value)
      : [];

    const payload = getProfileUpdatePayload(profileId, {
      healthInformation: {
        ...healthInformation,
        healthConditions: { conditions, notes: formData.notes },
      },
    });
    save.mutate(payload);
  };

  return (
    <SubInternalLayout title="Health Conditions &amp; Diseases">
      <form onSubmit={onSubmit}>
        <div className="mb-5">
          <HealthConditionsSelect
            value={null}
            onChange={(val) => {
              const newList = [...formData.conditions, val];
              onChange({ target: { name: "conditions", value: newList } });
            }}
          />
        </div>

        <div className="mb-5">
          {formData.conditions.map((c, cIndex) => {
            return (
              <div key={cIndex} className="field-list-item mt-4">
                <div className="float-end">
                  <Button
                    variant="link"
                    onClick={() => {
                      const newList = [...formData.conditions].filter(
                        (con) => con.value !== c.value
                      );
                      onChange({
                        target: { name: "conditions", value: newList },
                      });
                    }}
                  >
                    <Close />
                  </Button>
                </div>
                <span className="subtitle1">{c.label}</span>
              </div>
            );
          })}
        </div>

        <h3>Additional notes</h3>
        <Form.Control
          as="textarea"
          name="notes"
          onChange={onChange}
          placeholder="Add any additional information a helper should know."
          value={formData.notes}
          className="mb-3 mt-3"
          style={{ minHeight: "150px" }}
        />
        <Row>
          <Col>
            <Button variant="link" onClick={() => history.goBack()}>
              CANCEL
            </Button>
          </Col>
          <Col className="text-end">
            <Button
              type="primary"
              variant="primary"
              disabled={!hasChanged}
              style={{ minWidth: "200px" }}
            >
              SAVE
            </Button>
          </Col>
        </Row>
      </form>
      <br />
      <br />
      <br />
    </SubInternalLayout>
  );
};

export default HealthConditions;
