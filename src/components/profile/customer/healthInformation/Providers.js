import React, { useDispatch, useState } from "reactn";
import { useParams } from "react-router-dom";
import { Row, Col, Form, Button } from "react-bootstrap";
import get from "lodash.get";
import AddCircle from "@material-ui/icons/AddCircle";
import Close from "@material-ui/icons/Close";

import SubInternalLayout from "../../../layout/SubInternalLayout";
import InlineModal from "../../../common/InlineModal";
import ProviderSelect from "./ProviderSelect";
import { useFormData } from "../../../../hooks/useFormData";
import { useApiPut } from "../../../../hooks/useApi";
import { useProfile } from "../../../../hooks/useProfile";
import { getProfileUpdatePayload } from "../../../../lib/profileHelpers";

const formDefaults = {
  provider: null,
  taxonomy: "",
  phone: "",
};

const Providers = () => {
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
    const providers = healthInformation.providers || [];

    const payload = getProfileUpdatePayload(profileId, {
      healthInformation: {
        ...healthInformation,
        providers: [
          ...providers,
          {
            npi: formData.provider.value,
            name: formData.provider.label,
            taxonomy: formData.taxonomy,
            phone: formData.phone,
          },
        ],
      },
    });

    save.mutate(payload);
  };

  const showList = () => {
    const providers = get(profile, "healthInformation.providers", []);

    if (providers.length === 0) {
      return null;
    }

    return providers.map((provider, pIndex) => {
      const d = [];
      if (provider.taxonomy) {
        d.push(
          <span key={0} className="body1 d-block" style={{ color: "#857070" }}>
            {provider.taxonomy}
          </span>
        );
      }
      if (provider.phone) {
        d.push(
          <span key={0} className="body1 d-block" style={{ color: "#857070" }}>
            {provider.phone}
          </span>
        );
      }

      return (
        <div key={pIndex} className="field-list-item mt-4">
          <div className="float-end">
            <Button
              variant="link"
              onClick={() => {
                const healthInformation = profile.healthInformation || {};
                const newList = [...providers].filter(
                  (p) => p._id !== provider._id
                );

                const payload = getProfileUpdatePayload(profileId, {
                  healthInformation: {
                    ...healthInformation,
                    providers: newList,
                  },
                });

                save.mutate(payload);
              }}
            >
              <Close />
            </Button>
          </div>
          <span className="body2 d-block">{provider.name}</span>
          {d.length > 0 ? d : null}
        </div>
      );
    });
  };

  return (
    <SubInternalLayout title="Healthcare Providers" alertMutate={save}>
      <div style={{ position: "relative" }} className="mb-5">
        <InlineModal show={showForm} toggle={() => setShowForm(false)}>
          <form onSubmit={onSubmit}>
            <h3>Add a healthcare provider</h3>
            <ProviderSelect
              value={formData.provider}
              onChange={(val) =>
                setData(
                  {
                    provider: val,
                    phone: val.record.phone,
                    taxonomy: val.record.taxonomy,
                  },
                  true
                )
              }
            />
            <br />
            <Row>
              <Col xs={12} sm={12} md={6}>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={onChange}
                  placeholder="Phone"
                />
              </Col>
              <Col xs={12} sm={12} md={6}>
                <Form.Select
                  name="taxonomy"
                  onChange={onChange}
                  value={formData.taxonomy}
                >
                  <option>Type of provider</option>
                  <option value="Family practice">Family practice</option>
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
                  disabled={save.isLoading || !hasChanged || !formData.provider}
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
        <AddCircle /> ADD A PROVIDER
      </Button>
      <br />
      <br />
      <br />
    </SubInternalLayout>
  );
};

export default Providers;
