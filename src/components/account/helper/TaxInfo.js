import React, { useGlobal, useDispatch } from "reactn";
import { Link } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import get from "lodash.get";

import Texture from "@material-ui/icons/Texture";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

const TaxInfo = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    taxId: get(user, "helper.taxId") || "",
  });
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
    <SubInternalLayout alertMutate={save} title={`Tax Info`}>
      <div className="field-list-item">
        <Form.Group>
          <Form.Control
            type="text"
            name="taxId"
            placeholder="Tax ID or Social Security Number"
            onChange={onChange}
            value={formData.taxId}
          />
        </Form.Group>

        <Link
          to=""
          style={{
            display: "block",
            margin: "1.5rem 0",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1.15rem",
          }}
        >
          <Texture /> DOWNLOAD MY 1099
        </Link>
        <Link
          to=""
          style={{
            display: "block",
            margin: "1.5rem 0",
            textDecoration: "none",
            fontWeight: 600,
            fontSize: "1.15rem",
          }}
        >
          <Texture /> DOWNLOAD MY PROOF OF INCOME
        </Link>
      </div>

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              "helper.taxId": formData.taxId,
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

export default TaxInfo;
