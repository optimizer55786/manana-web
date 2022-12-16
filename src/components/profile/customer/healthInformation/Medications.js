import React, { useDispatch, useState } from "reactn";
import { useHistory, useParams } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import get from "lodash.get";
import AddCircle from "@material-ui/icons/AddCircle";
import Close from "@material-ui/icons/Close";

import SubInternalLayout from "../../../layout/SubInternalLayout";
import InlineModal from "../../../common/InlineModal";
import MedicationsSelect from "./MedicationsSelect";
import { useFormData } from "../../../../hooks/useFormData";
import { useApiPut } from "../../../../hooks/useApi";
import { useProfile } from "../../../../hooks/useProfile";
import { getProfileUpdatePayload } from "../../../../lib/profileHelpers";

const formDefaults = {
  medication: null,
  dosage: "",
  frequency: "",
};

const Medications = () => {
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const [showForm, setShowForm] = useState(false);
  const { formData, onChange, hasChanged, setData } = useFormData(formDefaults);

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    setShowForm(false);
  });

  const onSubmit = (e) => {
    e.preventDefault();
    const healthInformation = profile.healthInformation || {};
    const medications = healthInformation.medications || [];

    const payload = getProfileUpdatePayload(profileId, {
      healthInformation: {
        ...healthInformation,
        medications: [
          ...medications,
          {
            medication: formData.medication.value,
            dosage: formData.dosage,
            frequency: formData.frequency,
          },
        ],
      },
    });

    save.mutate(payload);
  };

  const showList = () => {
    const medications = get(profile, "healthInformation.medications", []);

    if (medications.length === 0) {
      return null;
    }

    return medications.map((med, mIndex) => {
      const d = [];
      if (med.dosage) {
        d.push(med.dosage);
      }
      if (med.frequency) {
        d.push(med.frequency);
      }

      return (
        <div key={mIndex} className="field-list-item mt-4">
          <div className="float-end">
            <Button
              variant="link"
              onClick={() => {
                const healthInformation = profile.healthInformation || {};
                const newList = [...medications].filter(
                  (m) => m._id !== med._id
                );

                const payload = getProfileUpdatePayload(profileId, {
                  healthInformation: {
                    ...healthInformation,
                    medications: newList,
                  },
                });

                save.mutate(payload);
              }}
            >
              <Close />
            </Button>
          </div>
          <span className="body2 d-block">{med.medication}</span>
          {d.length > 0 ? (
            <span className="body1" style={{ color: "#857070" }}>
              {d.join(", ")}
            </span>
          ) : null}
        </div>
      );
    });
  };

  return (
    <SubInternalLayout title="Medications" alertMutate={save}>
      <div style={{ position: "relative" }} className="mb-5">
        <InlineModal show={showForm} toggle={() => setShowForm(false)}>
          <form onSubmit={onSubmit}>
            <h3>Add a medication</h3>
            <MedicationsSelect
              value={formData.medication}
              onChange={(val) =>
                onChange({ target: { name: "medication", value: val } })
              }
            />
            <br />
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Control
                  type="text"
                  name="dosage"
                  value={formData.dosage}
                  onChange={onChange}
                  placeholder="dosage"
                />
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Select
                  name="frequency"
                  onChange={onChange}
                  value={formData.frequency}
                >
                  <option>Frequency</option>
                  <option value="1x day">1x day</option>
                </Form.Select>
              </Col>
            </Row>
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
                  type="submit"
                  className="add-padding"
                  disabled={
                    save.isLoading || !hasChanged || !formData.medication
                  }
                >
                  SAVE
                </Button>
              </Col>
            </Row>
          </form>
        </InlineModal>
      </div>
      {showList()}

      <Button
        variant="link"
        onClick={() => {
          setShowForm(true);
          setData(formDefaults);
        }}
        style={{ textDecoration: "none" }}
        className="ps-0"
      >
        <AddCircle /> ADD A MEDICATION
      </Button>
      <br />
      <br />
      <br />
    </SubInternalLayout>
  );
};

export default Medications;
