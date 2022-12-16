import React, { useGlobal, useDispatch, useState } from "reactn";
import {
  FormGroup,
  FormControl,
  Button,
  FloatingLabel,
  FormSelect,
  FormCheck,
  Card,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import InputMask from "react-input-mask";

import AddCircle from "@material-ui/icons/AddCircle";
import Edit from "@material-ui/icons/Edit";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { useProfile } from "../../../hooks/useProfile";
import Delete from "@material-ui/icons/Delete";

const defaultVals = {
  name: "",
  phone: "",
  relationship: "Child",
  primaryContact: false,
};

const EmergencyContacts = () => {
  const [user] = useGlobal("user");
  const [edit, setEdit] = useState(null);
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const { formData, hasChanged, onChange, setData } = useFormData(defaultVals);

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    setEdit(null);
  });

  const onSubmit = (e) => {
    e.preventDefault();

    const payload = {
      "customer.profiles": [...user.customer.profiles],
    };

    // get the profile currently selected by id
    payload["customer.profiles"].forEach((pro, proIndex) => {
      if (pro._id === profile._id) {
        // ensure we are working with an array and not a null
        pro.emergencyContacts = pro.emergencyContacts || [];

        // simplify the addition of a new contact
        if (edit === "new") {
          pro.emergencyContacts.push({ ...formData });
        } else {
          // do the whole for each stuff again since we are spreading and will lose the reference to the key
          pro.emergencyContacts.forEach((con, conIndex) => {
            if (con._id === edit) {
              pro.emergencyContacts[conIndex] = { ...con, ...formData };
            }
          });
        }

        // overwrite this index because of some spread action above
        payload["customer.profiles"][proIndex] = pro;
      }
    });

    save.mutate(payload);
  };

  const showForm = () => {
    return (
      <Card style={{ maxWidth: 450 }}>
        <Card.Body>
          <form onSubmit={onSubmit}>
            <FormGroup className="mb-4">
              <FloatingLabel label="Full Name">
                <FormControl
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  onChange={onChange}
                  value={formData.name}
                  required={true}
                />
              </FloatingLabel>
            </FormGroup>

            <FormGroup className="mb-4">
              <InputMask
                type="tel"
                name="phone"
                mask="999-999-9999"
                className="form-control"
                placeholder="123-123-1234"
                onChange={onChange}
                value={formData.phone}
                required={true}
              />
            </FormGroup>

            <FormGroup className="mb-4">
              <FormSelect
                size="lg"
                name="relationship"
                value={formData.relationship}
                required={true}
                onChange={onChange}
              >
                <option value="Child">Child</option>
                <option value="Spouse">Spouse</option>
                <option value="Parent">Parent</option>
                <option value="Niece/Nephew">Niece/Nephew</option>
              </FormSelect>
            </FormGroup>

            <FormGroup>
              <FormCheck
                type="checkbox"
                label="Primary Contact"
                name="primaryContact"
                value={true}
                checked={formData.primaryContact}
                onChange={(e) =>
                  onChange({
                    target: { name: "primaryContact", value: e.target.checked },
                  })
                }
              />
            </FormGroup>

            <div className="mt-3">
              <Row>
                <Col>
                  <Button
                    variant="link"
                    onClick={() => setEdit(null)}
                    style={{
                      textDecoration: "none",
                      fontWeight: 700,
                      paddingLeft: 0,
                    }}
                  >
                    CANCEL
                  </Button>
                </Col>
                <Col className="text-end">
                  <Button
                    type="submit"
                    disabled={!hasChanged || save.isLoading}
                  >
                    {save.isLoading ? <SpinIcon /> : "SAVE TO LIST"}
                  </Button>
                </Col>
              </Row>
            </div>
          </form>
        </Card.Body>
      </Card>
    );
  };

  const showList = () => {
    const list = profile.emergencyContacts || [];
    return (
      <div>
        {list.map((contact, i) => {
          return (
            <div
              style={{ borderBottom: "1px solid #EBE0DE" }}
              key={i}
              className="mb-4"
            >
              <div className="float-end">
                <Button
                  size="sm"
                  variant="link"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    setData({ ...formData, ...contact });
                    setEdit(contact._id);
                  }}
                >
                  <Edit />
                </Button>
                <Button
                  size="sm"
                  variant="link"
                  style={{ textDecoration: "none" }}
                  onClick={() => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete this contact?"
                      )
                    ) {
                      const payload = {
                        "customer.profiles": [...user.customer.profiles],
                      };

                      payload["customer.profiles"].forEach((pro, proIndex) => {
                        pro.emergencyContacts = pro.emergencyContacts.filter(
                          (c) => c._id !== contact._id
                        );
                        payload["customer.profiles"][proIndex] = pro;
                      });

                      save.mutate(payload);
                    }
                  }}
                >
                  <Delete />
                </Button>
              </div>
              <p className="body2 mb-1">
                {contact.name}
                {contact.primaryContact ? (
                  <Badge bg="secondary" className="ms-2">
                    PRIMARY
                  </Badge>
                ) : null}
              </p>
              <p className="text-muted body1 mb-1">{contact.phone}</p>
              <p className="text-muted body1 mb-1">{contact.relationship}</p>
            </div>
          );
        })}
        <Button
          variant="link"
          onClick={() => {
            setData(defaultVals);
            setEdit("new");
          }}
          style={{ textDecoration: "none" }}
          className="ps-0"
        >
          <AddCircle /> ADD AN EMERGENCY CONTACT
        </Button>
      </div>
    );
  };

  return (
    <SubInternalLayout alertMutate={save} title={`Emergency Contacts`}>
      {edit !== null ? showForm() : showList()}
      <br />
      <br />
    </SubInternalLayout>
  );
};

export default EmergencyContacts;
