import React, { useGlobal, useDispatch, useRef } from "reactn";
import { useHistory } from "react-router-dom";
import {
  Row,
  Col,
  Button,
  ButtonGroup,
  Form,
  FloatingLabel,
} from "react-bootstrap";
import moment from "moment-timezone";
import Select from "react-select";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import { getLanguageNames } from "../../../lib/languageHelpers";


const getOptions = () => {
  const names = getLanguageNames();
  return names.map((n) => {
    return { label: n, value: n };
  });
};

const getDefaultValues = (user) => {
  return {
    jobRequestFor: "other",
    relationship: "",
    name: "",
    preferredName: "",
    email: "",
    phone: "",
    phoneType: "",
    dateOfBirth: "",
    preferredLanguage: null,
    street1: "",
    street2: "",
    city: "",
    state: "",
    zip: "",
  };
};

const AddProfile = () => {
  const exitAfterSaveInputRef = useRef(null);
  const formRef = useRef(null);
  const [user] = useGlobal("user");
  const history = useHistory();
  const { formData, onChange } = useFormData(getDefaultValues(user));
  const updateUser = useDispatch("updateUser");
  const isExistMe = user.customer.profiles.find((p) => p.relationship === '_self') !== undefined;
  const apiPut = useApiPut("/users/profile", (resp) => {
    // update the global user with the new profile
    updateUser({ ...resp });    
  });

  const onSubmit = (e) => {
    e.preventDefault();

    // load it up as if for the user themselves
    let payload = {
      $push: {
        "customer.profiles": {
          name: formData.name,
          relationship:
            formData.jobRequestFor === "me" ? "_self" : formData.relationship,
          email: formData.email || null,
          phone: formData.phone,
          phoneType: formData.phoneType || null,
          address: {
            street1: formData.street1,
            street2: formData.street2 || null,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
          },
          dateOfBirth: formData.dateOfBirth
            ? moment
                .utc(formData.dateOfBirth, "YYYY-MM-DD")
                .set({ hour: 12, minute: 0 })
                .toDate()
            : null,
          preferredName: formData.preferredName || null,
          preferredLanguage: formData.preferredLanguage || null,
        },
      }
    };

    apiPut.mutate(payload);
  };

  return (
    <SubInternalLayout title={`Add a profile`}>      
      <form onSubmit={onSubmit} ref={formRef}>
        <input
          type="hidden"
          id="exitAfterSave"
          name="exitAfterSave"
          ref={exitAfterSaveInputRef}
          value="0"
          onChange={() => null}
        />

        <Form.Group className="mb-4">
          <h3>Who is this help request for?</h3>
          <ButtonGroup className="full-width">
            <Button
              onClick={() =>
                onChange({
                  target: { name: "jobRequestFor", value: "me" },
                })
              }
              variant={
                formData.jobRequestFor === "me"
                  ? "secondary"
                  : "outline-secondary"
              }
              disabled={isExistMe}
            >
              ME
            </Button>{" "}
            <Button
              onClick={() =>
                onChange({ target: { name: "jobRequestFor", value: "other" } })
              }
              variant={
                formData.jobRequestFor === "other"
                  ? "secondary"
                  : "outline-secondary"
              }
            >
              SOMEONE ELSE
            </Button>
          </ButtonGroup>
        </Form.Group>

        {formData.jobRequestFor === "" ? null : (
          <>
            {formData.jobRequestFor === "other" ? (
              <FloatingLabel
                controlId="relationship"
                label="Your relationship to this person"
              >
                <Form.Select
                  size="sm"
                  name="relationship"
                  value={formData.relationship}
                  style={{
                    fontSize: "1rem",
                    paddingTop: "1.625rem",
                    paddingBottom: "0.625rem",
                    paddingLeft: "0.75rem",
                  }}
                  onChange={onChange}
                >
                  <option value="">Select one</option>
                  <option value="Child">Child</option>
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Niece/Nephew">Niece/Nephew</option>
                </Form.Select>
              </FloatingLabel>
            ) : null}

            <hr />

            <h3>Basic info</h3>
            <p className="text-muted body1">
              This info will only be shared with a helper after booking is
              confirmed.
            </p>

            <FloatingLabel controlId="name" label="Full name">
              <Form.Control
                type="text"
                name="name"
                size="sm"
                value={formData.name}
                onChange={onChange}
                required={true}
              />
            </FloatingLabel>
            <br />

            <div className="text-end">
              <small className="text-muted">(optional)</small>
            </div>
            <FloatingLabel controlId="preferredName" label="Preferred name">
              <Form.Control
                type="text"
                name="preferredName"
                size="sm"
                value={formData.preferredName}
                onChange={onChange}
              />
            </FloatingLabel>
            <br />

            {formData.jobRequestFor === "me" ? null : (
              <>
                <div className="text-end">
                  <small className="text-muted">(optional)</small>
                </div>
                <FloatingLabel controlId="email" label="Email">
                  <Form.Control
                    type="email"
                    name="email"
                    size="sm"
                    value={formData.email}
                    onChange={onChange}
                  />
                </FloatingLabel>
                <br />
                <PhoneInput
                  country={'us'}
                  value={''}
                  name="phone"
                  placeholder="Phone number"
                  value={formData.phone}
                  style={{height: 58}}
                  inputStyle={{height: 58}}
                  onChange={(value, country, e, formattedValue) => onChange(e)}
                />
                <br />

                <div className="text-end">
                  <small className="text-muted">(optional)</small>
                </div>
                <FloatingLabel controlId="phoneType" label="Phone type">
                  <Form.Select
                    size="sm"
                    name="phoneType"
                    value={formData.phoneType}
                    onChange={onChange}
                    style={{
                      fontSize: "1rem",
                      paddingTop: "1.625rem",
                      paddingBottom: "0.625rem",
                      paddingLeft: "0.75rem",
                    }}
                  >
                    <option value="">Phone type</option>
                    <option value="Mobile">Mobile</option>
                    <option value="Land">Land</option>
                  </Form.Select>
                </FloatingLabel>
                <br />
              </>
            )}

            <div className="text-end">
              <small className="text-muted">(optional)</small>
            </div>
            <FloatingLabel controlId="dateOfBirth" label="Date of birth">
              <Form.Control
                type="date"
                name="dateOfBirth"
                size="sm"
                value={formData.dateOfBirth}
                onChange={onChange}
              />
            </FloatingLabel>
            <br />

            <div className="text-end">
              <small className="text-muted">(optional)</small>
            </div>
            <Select
              options={getOptions()}
              isMulti={false}
              isSearchable={true}
              value={
                formData.preferredLanguage
                  ? {
                      label: formData.preferredLanguage,
                      value: formData.preferredLanguage,
                    }
                  : null
              }
              onChange={(sel) => {
                onChange({
                  target: {
                    name: "preferredLanguage",
                    value: sel.value,
                  },
                });
              }}
              placeholder="Preferred Language"
            />

            <hr />

            <h3>
              What's {formData.jobRequestFor === "me" ? "your" : "their"} address?
            </h3>

            <FloatingLabel controlId="street1" label="Street address">
              <Form.Control
                type="text"
                name="street1"
                size="sm"
                value={formData.street1}
                onChange={onChange}
                required={true}
              />
            </FloatingLabel>
            <br />

            <div className="text-end">
              <small className="text-muted">(optional)</small>
            </div>
            <FloatingLabel controlId="street2" label="Apt, suite, etc">
              <Form.Control
                type="text"
                name="street2"
                size="sm"
                value={formData.street2}
                onChange={onChange}
              />
            </FloatingLabel>
            <br />

            <FloatingLabel controlId="city" label="City">
              <Form.Control
                type="text"
                name="city"
                size="sm"
                value={formData.city}
                onChange={onChange}
                required={true}
              />
            </FloatingLabel>
            <br />

            <Row>
              <Col xs={4}>
                <FloatingLabel controlId="state" label="State">
                  <Form.Select
                    size="sm"
                    name="state"
                    value={formData.state}
                    onChange={onChange}
                    style={{
                      fontSize: "1rem",
                      paddingTop: "1.625rem",
                      paddingBottom: "0.625rem",
                      paddingLeft: "0.75rem",
                    }}
                  >
                    <option value="">Select one</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </Form.Select>
                </FloatingLabel>
              </Col>
              <Col xs={8}>
                <FloatingLabel controlId="zip" label="Zip code">
                  <Form.Control
                    type="text"
                    name="zip"
                    size="sm"
                    value={formData.zip}
                    onChange={onChange}
                    required={true}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </>
        )}

        <hr />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ minWidth: 200 }}
          disabled={
            apiPut.isLoading ||
            (formData.jobRequestFor === "other" && !formData.relationship) ||
            !formData.name ||
            !formData.street1 ||
            !formData.city ||
            !formData.state ||
            !formData.zip
          }
          className="w-100"
        >
          {apiPut.isLoading ? "..." : "CREATE PROFILE"}
        </Button>
      </form>
      <br />
      <br />
    </SubInternalLayout>
  );
};

export default AddProfile;
