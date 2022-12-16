import React, { useGlobal, useDispatch, useState } from "reactn";
import {
  FormGroup,
  FormLabel,
  FormControl,
  FormSelect,
  FormCheck,
  Button,
} from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Edit from "@material-ui/icons/Edit";
import InputMask from "react-input-mask";
import moment from "moment-timezone";
import get from "lodash.get";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

import { DateLabel, PhoneLabel, TextLabel } from "../../common/labels";

const PersonalInformation = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange, toggleCheckboxValue } = useFormData({
    mobile: user.settings.mobile || "",
    gender: get(user, "helper.profile.gender") || "",
    dob: get(user, "helper.profile.dateOfBirth") || "",
    vehicleAvailable: get(user, "helper.vehicleAvailable") || false,
    vehicleCovers: get(user, "helper.vehicleCovers") || [],
  });
  const [toggled, setToggled] = useState({
    mobile: formData.mobile === "",
    gender: formData.gender === "",
    dob: formData.dob === "",
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
      <div className="field-list-item">
        <FormGroup>
          {toggleBtn("mobile")}
          <FormLabel>Mobile Phone Number</FormLabel>
          {!toggled.mobile ? (
            <PhoneLabel val={formData.mobile} />
          ) : (
            <InputMask
              type="tel"
              name="mobile"
              mask="999-999-9999"
              className="form-control"
              placeholder="123-123-1234"
              onChange={onChange}
              value={formData.mobile}
            />
          )}
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
          {toggleBtn("dob")}
          <FormLabel>Date of Birth</FormLabel>
          {!toggled.dob ? (
            <DateLabel val={formData.dob} />
          ) : (
            <FormControl
              type="date"
              name="dob"
              onChange={(e) => {
                let v = e.target.value ? moment(e.target.value).toDate() : null;
                onChange({ target: { name: e.target.name, value: v } });
              }}
              value={
                formData.dob ? moment(formData.dob).format("YYYY-MM-DD") : ""
              }
            />
          )}
        </FormGroup>
      </div>
      <div className="field-list-item">
        <FormGroup>
          <FormLabel>Vehicle Information</FormLabel>
          {[
            {
              label: "A wheelchair",
              value: "A wheelchair",
            },
            {
              label: "A walker",
              value: "A walker",
            },
            {
              label: "I don't have a car",
              value: "I don't have a car",
            },
          ].map((opt, i) => {
            return (
              <FormCheck
                type="checkbox"
                key={i}
                label={opt.label}
                value={opt.value}
                checked={formData.vehicleCovers.includes(opt.value)}
                onChange={(e) =>
                  toggleCheckboxValue("vehicleCovers", e.target.value)
                }
              />
            );
          })}
        </FormGroup>
      </div>

      <div className="text-end">
        <Button
          type="button"
          onClick={() => {
            save.mutate({
              "settings.mobile": formData.mobile || undefined,
              "helper.profile.gender": formData.gender || undefined,
              "helper.profile.dateOfBirth": formData.dob || undefined,
              "helper.vehicleAvailable": formData.vehicleAvailable,
              "helper.vehicleCovers": formData.vehicleCovers,
            });
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
