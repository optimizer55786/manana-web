import React, { useGlobal, useDispatch } from "reactn";
import { FormGroup, FormControl, Button } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import get from "lodash.get";

import SubInternalLayout from "../../layout/SubInternalLayout";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";
import { useProfile } from "../../../hooks/useProfile";

const AboutMe = () => {
  const [user] = useGlobal("user");
  const history = useHistory();
  const { profileId } = useParams();
  const profile = useProfile(profileId);
  const { formData, hasChanged, onChange } = useFormData({
    about: get(profile, "description") || "",
  });

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

  return (
    <SubInternalLayout alertMutate={save} title={`About me`}>
      <p className="text-muted body1">
        What are your hobbies/interests? Another prompting sentence?
      </p>

      <FormGroup>
        <FormControl
          as="textarea"
          name="about"
          className="form-control"
          placeholder="Tell us a bit about you."
          onChange={onChange}
          value={formData.about}
          style={{ minHeight: 120 }}
          maxLength={250}
        />
      </FormGroup>
      <p className="text-end m-0 p-0">
        <strong>{formData.about.length}/250 CHAR MAX</strong>
      </p>

      <div className="text-end mt-3">
        <Button
          type="button"
          onClick={() => {
            const payload = {
              "customer.profiles": [...user.customer.profiles],
            };

            // get the profile currently selected by id
            const p = payload["customer.profiles"].find(
              (pro) => pro._id === profile._id
            );

            // update the record from the spread above
            p.description = formData.about;

            save.mutate(payload);
          }}
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

export default AboutMe;
