import React, { useGlobal, useDispatch } from "reactn";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import get from "lodash.get";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useFieldToggle } from "../../../hooks/useFieldToggle";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { TextLabel } from "../../common/labels";

const AccountSettings = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange, toggleCheckboxValue } = useFormData({
    email: get(user, "email") || "",
    jobTypes: get(user, "helper.jobTypes") || [],
    overnight: get(user, "helper.availableOvernight") || false,
  });
  const { isToggled, toggleBtn } = useFieldToggle();
  const history = useHistory();

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push("/account", {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

  return (
    <SubInternalLayout alertMutate={save} title={`Account Settings`}>
      <div className="field-list-item">
        <Form.Group>
          {toggleBtn("email")}
          <Form.Label>Email</Form.Label>
          {!isToggled("email") ? (
            <TextLabel val={formData.email} />
          ) : (
            <Form.Control
              type="email"
              name="email"
              placeholder="email address"
              onChange={onChange}
              value={formData.email}
            />
          )}
        </Form.Group>
      </div>

      <div className="field-list-item">
        <Form.Group>
          <Form.Label className="mb-3">
            What kind of jobs are you seeking?
          </Form.Label>
          {[
            {
              label: "I want one-time jobs",
              value: "One-Time",
            },
            {
              label: "I want recurring jobs",
              value: "Recurring",
            },
          ].map((opt, i) => {
            return (
              <Form.Check
                type="checkbox"
                key={i}
                label={opt.label}
                value={opt.value}
                checked={formData.jobTypes.includes(opt.value)}
                onChange={(e) =>
                  toggleCheckboxValue("jobTypes", e.target.value)
                }
              />
            );
          })}
          <Form.Check
            type="checkbox"
            label="I want overnight jobs"
            value="overnight"
            checked={formData.overnight}
            onChange={(e) =>
              onChange({
                target: { name: "overnight", value: e.target.checked },
              })
            }
          />
        </Form.Group>
      </div>

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              email: formData.email,
              "helper.jobTypes": formData.jobTypes,
              "helper.availableOvernight": formData.overnight,
            })
          }
          disabled={!hasChanged || save.isLoading}
        >
          {save.isLoading ? <SpinIcon /> : "Save Changes"}
        </Button>
      </div>

      <br />
      <br />
    </SubInternalLayout>
  );
};

export default AccountSettings;
