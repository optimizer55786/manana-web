import React, { useGlobal, useDispatch, useState } from "reactn";
import {
  Row,
  Col,
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
} from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";
import InputMask from "react-input-mask";
import moment from "moment-timezone";
import Select from "react-select";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { useProfile } from "../../../hooks/useProfile";
import { getLanguageNames } from "../../../lib/languageHelpers";

import {
  DateLabel,
  PhoneLabel,
  TextLabel,
  AddressLabel,
} from "../../common/labels";

const getOptions = () => {
  const names = getLanguageNames();
  return names.map((n) => {
    return { label: n, value: n };
  });
};

const PersonalInformation = () => {
  const [user] = useGlobal("user");
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const { formData, hasChanged, onChange } = useFormData({
    phone: profile.phone || "",
    phoneType: profile.phoneType || "",
    helperCanCall: profile.helperCanCall || false,
    gender: profile.gender || "",
    address: profile.address || {
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
    },
    email: profile.email || "",
    dateOfBirth: profile.dateOfBirth
      ? moment(profile.dateOfBirth).format("YYYY-MM-DD")
      : "",
    preferredName: profile.preferredName || "",
    preferredLanguage: profile.preferredLanguage || null,
  });
  const [toggled, setToggled] = useState({
    phone: formData.phone === "",
    phoneType: formData.phoneType === "",
    gender: formData.gender === "",
    dateOfBirth: formData.dateOfBirth === "",
  });
  const history = useHistory();

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push("/profile", {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

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
    <SubInternalLayout alertMutate={save} title={`Personal Information`}>
      <div className="field-list-item mt-4">
        <FormGroup>
          {toggleBtn("phone")}
          <FormLabel>Phone Number</FormLabel>
          {!toggled.phone ? (
            <PhoneLabel val={formData.phone} />
          ) : (
            <InputMask
              type="tel"
              name="phone"
              mask="999-999-9999"
              className="form-control"
              placeholder="123-123-1234"
              onChange={onChange}
              value={formData.phone}
            />
          )}
        </FormGroup>
        {!toggled.phone ? null : (
          <FormGroup className="mt-4">
            <FormLabel>Phone Type</FormLabel>
            <FormSelect
              name="phoneType"
              onChange={onChange}
              value={formData.phoneType}
            >
              {[
                {
                  label: "Select a phone type",
                  value: "",
                },
                {
                  label: "Mobile",
                  value: "Mobile",
                },
                {
                  label: "Land",
                  value: "Land",
                },
              ].map((opt, i) => {
                return (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                );
              })}
            </FormSelect>
          </FormGroup>
        )}
        <FormGroup className="mt-4">
          <FormCheck
            type="checkbox"
            label="A helper can call this number"
            value={true}
            checked={formData.helperCanCall}
            onChange={(e) => {
              onChange({
                target: { name: "helperCanCall", value: e.target.checked },
              });
            }}
          />
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("gender")}
          <FormLabel>Gender</FormLabel>
          {!toggled.gender ? (
            <TextLabel val={formData.gender} />
          ) : (
            <FormSelect
              name="gender"
              onChange={onChange}
              value={formData.gender}
            >
              {[
                {
                  label: "Select your gender identity",
                  value: "",
                },
                {
                  label: "Female",
                  value: "Female",
                },
                {
                  label: "Male",
                  value: "Male",
                },
                {
                  label: "Non-binary",
                  value: "Non-binary",
                },
                {
                  label: "Prefer not to respond",
                  value: "Prefer not to respond",
                },
              ].map((opt, i) => {
                return (
                  <option key={i} value={opt.value}>
                    {opt.label}
                  </option>
                );
              })}
            </FormSelect>
          )}
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("address")}
          <FormLabel>Address</FormLabel>
          {!toggled.address ? (
            <AddressLabel val={formData.address} />
          ) : (
            <>
              <FormControl
                type="text"
                name="street1"
                onChange={onChange}
                value={formData.address.street1}
                placeholder="Street 1"
                className="mb-3"
              />
              <FormControl
                type="text"
                name="street2"
                onChange={onChange}
                value={formData.address.street2}
                placeholder="Street 2"
                className="mb-3"
              />
              <FormControl
                type="text"
                name="city"
                onChange={onChange}
                value={formData.address.city}
                placeholder="City"
                className="mb-3"
              />
              <Row>
                <Col>
                  <FormControl
                    type="text"
                    name="state"
                    onChange={onChange}
                    value={formData.address.state}
                    placeholder="State"
                    maxLength={2}
                  />
                </Col>
                <Col>
                  <FormControl
                    type="text"
                    name="zip"
                    onChange={onChange}
                    value={formData.address.zip}
                    placeholder="Zip"
                    maxLength={5}
                  />
                </Col>
              </Row>
            </>
          )}
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("email")}
          <FormLabel>Email</FormLabel>
          {!toggled.email ? (
            <TextLabel val={formData.email} />
          ) : (
            <FormControl
              type="email"
              name="email"
              onChange={onChange}
              value={formData.email}
              placeholder="your.name@email.com"
            />
          )}
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("dateOfBirth")}
          <FormLabel>Age</FormLabel>
          {!toggled.dateOfBirth ? (
            <DateLabel val={formData.dateOfBirth} age={true} />
          ) : (
            <FormControl
              type="date"
              name="dateOfBirth"
              onChange={(e) => {
                let v = e.target.value ? moment(e.target.value).toDate() : null;
                onChange({ target: { name: e.target.name, value: v } });
              }}
              value={
                formData.dateOfBirth
                  ? moment(formData.dateOfBirth).format("YYYY-MM-DD")
                  : ""
              }
            />
          )}
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          <FormLabel>Preferred Language</FormLabel>
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
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("preferredName")}
          <FormLabel>Preferred Name</FormLabel>
          {!toggled.preferredName ? (
            <TextLabel val={formData.preferredName} />
          ) : (
            <FormControl
              type="text"
              name="preferredName"
              onChange={onChange}
              value={formData.preferredName}
              placeholder="Preferred Name"
            />
          )}
        </FormGroup>
      </div>

      <div className="text-end">
        <Button
          type="button"
          onClick={() => {
            const payload = {
              "customer.profiles": [...user.customer.profiles],
            };

            // get the profile currently selected by id
            payload["customer.profiles"].forEach((pro, i) => {
              if (pro._id === profile._id) {
                // because of the use of the spread below, we lose the reference
                // to the array index and so we have to overwrite it directly
                payload["customer.profiles"][i] = {
                  ...pro,
                  ...formData,
                };
              }
            });

            save.mutate(payload);
          }}
          disabled={!hasChanged}
        >
          {save.isLoading ? <SpinIcon /> : "Save Changes"}
        </Button>
      </div>

      <br />
      <br />
    </SubInternalLayout>
  );
};

export default PersonalInformation;
