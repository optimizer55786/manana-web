import React, { useGlobal, useDispatch } from "reactn";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import InputMask from "react-input-mask";
import get from "lodash.get";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useFieldToggle } from "../../../hooks/useFieldToggle";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { TextLabel } from "../../common/labels";

const PersonalInfo = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    email: get(user, "email") || "",
    phone: get(user, "settings.mobile") || "",
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
    <SubInternalLayout alertMutate={save} title={`Personal Info`}>
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
          {toggleBtn("phone")}
          <Form.Label>Phone number</Form.Label>
          {!isToggled("phone") ? (
            <TextLabel val={formData.phone} />
          ) : (
            <Form.Control
              as={InputMask}
              mask="999-999-9999"
              type="text"
              name="phone"
              placeholder="123-123-1234"
              onChange={onChange}
              value={formData.phone}
            />
          )}
        </Form.Group>
      </div>

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              email: formData.email,
              "settings.mobile": formData.phone,
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

export default PersonalInfo;
