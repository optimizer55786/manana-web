import React, { useGlobal, useDispatch } from "reactn";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import get from "lodash.get";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import Delete from "@material-ui/icons/Delete";
import { getLanguageNames } from "../../../lib/languageHelpers";
import ButtonList from "../../common/ButtonList";

const getOptions = () => {
  const names = getLanguageNames();
  return names.map((n) => {
    return { label: n, value: n };
  });
};

const Languages = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    languages: get(user, "helper.profile.languages"),
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

  return (
    <SubInternalLayout alertMutate={save} title={`Languages`}>
      <Form.Group>
        <Select
          options={getOptions()}
          isMulti={false}
          isSearchable={true}
          value={[]}
          onChange={(sel) => {
            const changes = [...formData.languages, sel.value];
            onChange({ target: { name: "languages", value: changes } });
          }}
        />
      </Form.Group>

      <ButtonList
        className="mt-4"
        buttons={formData.languages.map((l, i) => {
          return {
            label: l,
            icon: <Delete />,
            onClick: () => {
              const changes = [...formData.languages].filter(
                (lang) => lang !== l
              );
              onChange({ target: { name: "languages", value: changes } });
            },
          };
        })}
        emptyMsg="Please select one or more languages."
      />

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() =>
            save.mutate({
              "helper.profile.languages": formData.languages,
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

export default Languages;
