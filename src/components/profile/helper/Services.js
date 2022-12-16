import React, { useGlobal, useDispatch } from "reactn";
import { Form, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

import SubInternalLayout from "../../layout/SubInternalLayout";
import ServicesList from "../../common/ServicesList";
import { useFormData } from "../../../hooks/useFormData";
import { useApiPut } from "../../../hooks/useApi";
import SpinIcon from "../../common/SpinIcon";

const convert = (offered) => {
  const obj = {};

  offered.forEach((service) => {
    obj[service.service] = {};

    service.options.forEach((opt) => {
      obj[service.service][opt.key] = opt.value;
    });
  });

  return obj;
};

const revert = (selections) => {
  return Object.keys(selections).map((serviceId) => {
    return {
      service: serviceId,
      options: Object.keys(selections[serviceId]).map((option) => {
        return {
          key: option,
          value: selections[serviceId][option],
        };
      }),
    };
  });
};

const Services = () => {
  const [user] = useGlobal("user");
  const { formData, hasChanged, onChange } = useFormData({
    servicesOffered: convert(user.helper.servicesOffered),
    specializedCare: user.helper.specializedCare || [],
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

  const onCheckToggle = (care) => {
    let sel = [...formData.specializedCare];
    if (sel.includes(care)) {
      sel = sel.filter((item) => item !== care);
    } else {
      sel.push(care);
    }
    onChange({ target: { name: "specializedCare", value: sel } });
  };

  return (
    <SubInternalLayout alertMutate={save} title={`Services I'll Provide`}>
      <ServicesList
        values={formData.servicesOffered}
        onChange={(updates) => {
          onChange({ target: { name: "servicesOffered", value: updates } });
        }}
      />

      <h5 className="mt-5 mb-3">Specialized Care</h5>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check
          type="checkbox"
          label="Dementia Care"
          value="Dementia Care"
          checked={formData.specializedCare.includes("Dementia Care")}
          size="lg"
          onChange={(e) => onCheckToggle("Dementia Care")}
        />
      </Form.Group>

      <hr />
      <div className="text-end mb-5">
        <Button
          variant="primary"
          onClick={() => {
            const payload = {
              "helper.servicesOffered": revert(formData.servicesOffered),
              "helper.specializedCare": formData.specializedCare,
            };

            save.mutate(payload);
          }}
          disabled={!hasChanged}
        >
          {save.isLoading ? <SpinIcon /> : "Save Changes"}
        </Button>
      </div>
    </SubInternalLayout>
  );
};

export default Services;
