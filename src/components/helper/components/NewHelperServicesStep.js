import React, { useState } from "reactn";
import PropTypes from "prop-types";
import { Button, FormGroup, FormLabel, FormCheck } from "react-bootstrap";
import ArrowBack from "@material-ui/icons/ArrowBack";

import ServicesList from "../../common/ServicesList";

const NewHelperServicesStep = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    services: {},
    vehicleAvailable: false,
    vehicleCovers: null,
    dementiaCare: false,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    onComplete(formData);
  };

  const onChange = (e) => {
    const updates = { ...formData, [e.target.name]: e.target.value };

    // we need to pull the vehicle flags out of the services due to how
    // the form is layed out and buried within service objects
    if (e.target.name === "services") {
      if (e.target.value["60c3fd06573f8b1868c89ef2"]) {
        const acc = e.target.value["60c3fd06573f8b1868c89ef2"].accommodate;
        if (acc && acc.includes("I don't have a car")) {
          updates.vehicleAvailable = false;
          updates.vehicleCovers = null;
        } else if (acc) {
          updates.vehicleAvailable = true;
          updates.vehicleCovers = acc;
        }
      }
    }

    console.log("Updates: ", updates);

    setFormData(updates);
  };

  return (
    <form onSubmit={onSubmit}>
      <Button
        type="button"
        variant="link"
        onClick={() => onBack()}
        style={{ margin: 0, marginBottom: "2rem", padding: 0 }}
      >
        <ArrowBack />
      </Button>

      <ServicesList
        values={formData.services}
        onChange={(selections) =>
          onChange({ target: { name: "services", value: selections } })
        }
      />
      <hr />

      <h3 className="mb-3">
        Do you have experience in providing specialized care?
      </h3>
      <FormGroup className="mb-3" controlId="formBasicCheckbox">
        <FormCheck
          type="checkbox"
          label="Dementia Care"
          value="Dementia Care"
          checked={formData.dementiaCare}
          size="lg"
          onChange={(e) =>
            onChange({
              target: { name: "dementiaCare", value: e.target.checked },
            })
          }
        />
      </FormGroup>
      <hr />

      <div className="text-end">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          style={{ minWidth: 200 }}
          disabled={formData.services === null}
        >
          NEXT
        </Button>
      </div>
    </form>
  );
};

NewHelperServicesStep.propTypes = {
  onComplete: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
};

export default NewHelperServicesStep;
