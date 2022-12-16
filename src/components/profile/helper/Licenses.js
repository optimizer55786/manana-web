import React, { useGlobal, useDispatch } from "reactn";
import { Row, Col, Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import get from "lodash.get";

import Edit from "@material-ui/icons/Edit";
import PhotoCameraOutlined from "@material-ui/icons/PhotoCameraOutlined";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

const licenseList = [
  "Certified Nursing Assistant (CNA)",
  "Licensed Practical Nurse (LPN)",
  "Registered Nurse (RN)",
];

const Licenses = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    licenses: get(user, "helper.profile.licenses") || [],
  });
  const history = useHistory();

  const updateUser = useDispatch("updateUser");

  const save = useApiPut("/users/profile", (res) => {
    updateUser(res);
    history.push("/profile/skills-experience", {
      alert: {
        msg: "Your changes have been successfully saved.",
        variant: "success",
      },
    });
  });

  const isChecked = (val) => {
    if (!Array.isArray(formData.licenses)) {
      return false;
    }
    const lic = formData.licenses.find((l) => l.title === val);
    return lic ? true : false;
  };

  const toggleCheckbox = (lic) => {
    let sel = !Array.isArray(formData.licenses) ? [] : [...formData.licenses];

    if (isChecked(lic)) {
      sel = sel.filter((s) => s.title !== lic);
    } else {
      sel.push({ title: lic, location: null, image: null });
    }

    onChange({ target: { name: "licenses", value: sel } });
  };

  return (
    <SubInternalLayout alertMutate={save} title={`Licenses`}>
      {licenseList.map((lic, i) => {
        const item = formData.licenses.find((l) => l.title === lic);

        return (
          <div className="field-list-item" key={i}>
            <Form.Group>
              <Form.Check
                value={lic}
                label={lic}
                id={lic}
                checked={item ? true : false}
                onChange={() => toggleCheckbox(lic)}
              />
            </Form.Group>
            {item ? (
              <div className="mt-3">
                <Row>
                  <Col xs={9} sm={10} className="text-center">
                    <p>
                      {item.image ? (
                        <>[IMAGE]</>
                      ) : (
                        <>
                          <PhotoCameraOutlined /> Attach an image
                        </>
                      )}
                    </p>
                  </Col>
                  <Col xs={3} sm={2} className="text-end">
                    <Button
                      size="sm"
                      variant="link"
                      onClick={() => alert("Show overlay")}
                    >
                      <Edit />
                    </Button>
                  </Col>
                </Row>
              </div>
            ) : null}
          </div>
        );
      })}

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              "helper.profile.licenses": formData.licenses,
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

export default Licenses;
