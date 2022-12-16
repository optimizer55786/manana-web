import React, { useDispatch, useState } from "reactn";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import get from "lodash.get";

import SubInternalLayout from "../../../layout/SubInternalLayout";
import InlineModal from "../../../common/InlineModal";
import { useFormData } from "../../../../hooks/useFormData";
import { useApiPut } from "../../../../hooks/useApi";
import { useProfile } from "../../../../hooks/useProfile";
import { getProfileUpdatePayload } from "../../../../lib/profileHelpers";

const DailyCare = () => {
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const [showForm, setShowForm] = useState(false);
  const history = useHistory();
  const { formData, onChange, toggleCheckboxValue, hasChanged, setData } =
    useFormData({
      helpNeeded: get(profile, "healthInformation.dailyCare.helpNeeded", []),
      mobilityNeeds: get(
        profile,
        "healthInformation.dailyCare.mobilityNeeds",
        []
      ),
      notes: get(profile, "healthInformation.dailyCare.notes", ""),
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
    const payload = getProfileUpdatePayload(profileId, {
      healthInformation: { ...healthInformation, dailyCare: formData },
    });
    save.mutate(payload);
  };

  /* Feeding, Dressing, Personal hygiene, Continence, Toileting */

  const checkOpts = [
    {
      label: "Mobility assistance",
      key: "mobilityAssistance",
    },
    {
      label: "Feeding",
      key: "feeding",
    },
    {
      label: "Dressing",
      key: "dressing",
    },
    {
      label: "Personal hygiene",
      key: "personalHygiene",
    },
    {
      label: "Continence",
      key: "continence",
    },
    {
      label: "Toileting",
      key: "toileting",
    },
  ];

  return (
    <SubInternalLayout title="Help Needed For Daily Care" alertMutate={save}>
      <form onSubmit={onSubmit}>
        {checkOpts.map((opt, optIndex) => {
          return (
            <div key={optIndex} className="field-list-item mt-4">
              <Form.Check
                type="checkbox"
                label={opt.label}
                id={opt.key}
                checked={formData.helpNeeded.includes(opt.label)}
                onChange={(e) => {
                  if (opt.key === "mobilityAssistance") {
                    if (e.target.checked) {
                      setShowForm(true);
                      toggleCheckboxValue("helpNeeded", opt.label);
                    } else {
                      const newVals = formData.helpNeeded.filter(
                        (h) => h !== opt.label
                      );
                      setData(
                        {
                          helpNeeded: newVals,
                          mobilityNeeds: [],
                        },
                        true
                      );
                    }
                  } else {
                    toggleCheckboxValue("helpNeeded", opt.label);
                  }
                }}
              />
              {opt.key === "mobilityAssistance" ? (
                <div style={{ position: "relative" }}>
                  {formData.mobilityNeeds.length > 0 ? (
                    <Button
                      variant="link"
                      onClick={() => setShowForm(true)}
                      style={{ marginLeft: "42px", padding: 0 }}
                    >
                      {formData.mobilityNeeds.join(" ")}
                    </Button>
                  ) : null}
                  <InlineModal
                    show={showForm}
                    toggle={() => setShowForm(false)}
                  >
                    <form onSubmit={onSubmit}>
                      <h3>Mobility assistance</h3>
                      {[
                        "I use a wheelchair.",
                        "I use a walker.",
                        "I use a cane.",
                      ].map((sub, subIndex) => {
                        return (
                          <div key={subIndex} className="field-list-item mt-4">
                            <Form.Check
                              type="checkbox"
                              label={sub}
                              id={`cb-${sub}`
                                .toLowerCase()
                                .replace(/[^\w]/g, "")}
                              checked={formData.mobilityNeeds.includes(sub)}
                              onChange={() =>
                                toggleCheckboxValue("mobilityNeeds", sub)
                              }
                            />
                          </div>
                        );
                      })}
                      <br />
                      <br />
                      <Row>
                        <Col>
                          <Button
                            type="button"
                            variant="link"
                            onClick={() => setShowForm(false)}
                          >
                            CANCEL
                          </Button>
                        </Col>
                        <Col className="text-end">
                          <Button
                            className="add-padding"
                            onClick={() => setShowForm(false)}
                          >
                            SAVE
                          </Button>
                        </Col>
                      </Row>
                    </form>
                  </InlineModal>
                </div>
              ) : null}
            </div>
          );
        })}
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

export default DailyCare;
